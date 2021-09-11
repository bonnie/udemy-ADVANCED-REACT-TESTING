import axios from "axios";
import { expectSaga } from "redux-saga-test-plan";
import * as matchers from "redux-saga-test-plan/matchers";
import { StaticProvider, throwError } from "redux-saga-test-plan/providers";

import {
  holdReservation,
  purchasePayload,
  purchaseReservation,
} from "../../../test-utils/fake-data";
import { startToast } from "../../toast/redux/toastSlice";
import {
  cancelPurchaseServerCall,
  releaseServerCall,
  reserveTicketServerCall,
} from "../api";
import { TicketAction } from "../types";
import {
  cancelTransaction,
  generateErrorToastOptions,
  purchaseTickets,
  ticketFlow,
} from "./ticketSaga";
import {
  endTransaction,
  resetTransaction,
  selectors,
  startTicketAbort,
  startTicketPurchase,
  startTicketRelease,
} from "./ticketSlice";

const holdAction = {
  type: "test",
  payload: holdReservation,
};

const networkProviders: Array<StaticProvider> = [
  [matchers.call.fn(reserveTicketServerCall), null],
  [matchers.call.fn(releaseServerCall), null],
  [matchers.call.fn(cancelPurchaseServerCall), null],
];

test("cancelTransaction cancels hold and resets transaction", () => {
  return expectSaga(cancelTransaction, holdReservation)
    .provide(networkProviders)
    .call(releaseServerCall, holdReservation)
    .put(resetTransaction())
    .run();
});

describe("common to all flows", () => {
  test("starts with hold call to server", () => {
    return expectSaga(ticketFlow, holdAction)
      .provide(networkProviders)
      .dispatch(
        startTicketAbort({
          reservation: holdReservation,
          reason: "Abort! Abort!",
        })
      )
      .call(reserveTicketServerCall, holdReservation)
      .run();
  });
  test("show error toast and clean up after server error", () => {
    return (
      expectSaga(ticketFlow, holdAction)
        .provide([
          [
            matchers.call.fn(reserveTicketServerCall),
            throwError(new Error("it did not work")),
          ],
          // write provider for selector
          [
            matchers.select.selector(selectors.getTicketAction),
            TicketAction.hold,
          ],
          ...networkProviders,
        ])
        // assert on startToast action
        .put(
          startToast(
            generateErrorToastOptions("it did not work", TicketAction.hold)
          )
        )
        .call(cancelTransaction, holdReservation)
        .run()
    );
  });
});

describe("purchase flow", () => {
  test("network error on purchase shows toast and cancels transaction", () => {
    return expectSaga(ticketFlow, holdAction)
      .provide([
        [
          matchers.call.like({
            fn: reserveTicketServerCall,
            args: [purchaseReservation], // not holdReservation!
          }),
          throwError(new Error("it did not work")),
        ],
        [
          matchers.select.selector(selectors.getTicketAction),
          TicketAction.hold,
        ],
        ...networkProviders,
      ])
      .dispatch(startTicketPurchase(purchasePayload))
      .call.fn(cancelPurchaseServerCall)
      .put(
        startToast(
          generateErrorToastOptions("it did not work", TicketAction.hold)
        )
      )
      .call(cancelTransaction, holdReservation)
      .run();
  });
  test("abort purchase while call to server is running", () => {
    const cancelSource = axios.CancelToken.source();
    return (
      expectSaga(purchaseTickets, purchasePayload, cancelSource)
        .provide([
          ...networkProviders,
          {
            race: () => ({ abort: true }),
          },
        ])
        // TODO: handle race so abort wins
        .call(cancelSource.cancel)
        .call(cancelPurchaseServerCall, purchaseReservation)
        .put(startToast({ title: "purchase canceled", status: "warning" }))
        .call(cancelTransaction, holdReservation)
        .not.put(startToast({ title: "tickets purchased", status: "success" }))
        .run()
    );
  });
  test("successful purchase flow", () => {
    const cancelSource = axios.CancelToken.source();
    return expectSaga(purchaseTickets, purchasePayload, cancelSource)
      .provide(networkProviders)
      .call(reserveTicketServerCall, purchaseReservation, cancelSource.token)
      .call(releaseServerCall, holdReservation)
      .put(
        startToast({
          title: "tickets purchased",
          status: "success",
        })
      )
      .put(endTransaction())
      .not.call.fn(cancelSource.cancel)
      .not.call.fn(cancelPurchaseServerCall)
      .not.put(startToast({ title: "purchase canceled", status: "warning" }))
      .run();
  });
});

describe("hold cancellation", () => {
  test.each([
    { name: "cancel", actionCreator: startTicketRelease },
    { name: "abort", actionCreator: startTicketAbort },
  ])(
    // will not interpolate $name until
    // https://github.com/facebook/jest/pull/11388 is released
    "cancels hold and resets ticket transaction on $name",
    async ({ actionCreator }) => {
      return expectSaga(ticketFlow, holdAction)
        .provide(networkProviders)
        .dispatch(
          actionCreator({ reservation: holdReservation, reason: "test" })
        )
        .call(reserveTicketServerCall, holdReservation)
        .put(startToast({ title: "test", status: "warning" }))
        .call(cancelTransaction, holdReservation)
        .run();
    }
  );
});
