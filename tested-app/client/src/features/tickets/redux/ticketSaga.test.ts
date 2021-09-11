import axios from "axios";
import { select } from "redux-saga/effects";
import { expectSaga } from "redux-saga-test-plan";
import * as matchers from "redux-saga-test-plan/matchers";
import { throwError } from "redux-saga-test-plan/providers";

import { Reservation, TicketAction } from "../../../../../shared/types";
import { showToast } from "../../toast/redux/toastSlice";
import { ToastOptions } from "../../toast/types";
import {
  cancelPurchaseServerCall,
  releaseServerCall,
  reserveTicketServerCall,
} from "../api";
import {
  generateErrorToastOptions,
  purchaseTickets,
  ticketFlow,
} from "./ticketSaga";
import {
  endTransaction,
  PurchasePayload,
  resetTransaction,
  selectors,
  startTicketAbort,
  startTicketPurchase,
  startTicketRelease,
} from "./ticketSlice";

const holdReservation: Reservation = {
  id: 12345,
  showId: 54321,
  seatCount: 2,
  userId: 1,
  type: TicketAction.hold,
};

const holdAction = {
  type: "test", // type not necessary, but takeEvery passes whole action obj
  payload: holdReservation,
};

describe("ticketFlow ", () => {
  test("starts with server call to hold tickets", async () => {
    await expectSaga(ticketFlow, holdAction)
      .provide([
        [matchers.call.fn(reserveTicketServerCall), null],
        [matchers.call.fn(releaseServerCall), null],
      ])
      .call(reserveTicketServerCall, holdReservation)
      // to finish saga; need payload to avoid error
      .dispatch(
        startTicketRelease({
          reservation: holdReservation,
          reason: "end saga!",
        })
      )
      .run();
  });
  test("shows error upon network call error", () => {
    const errorToastOptions: ToastOptions = { title: "uh oh", status: "error" };

    return expectSaga(ticketFlow, holdAction)
      .provide([
        [
          matchers.call.fn(reserveTicketServerCall),
          throwError(new Error("test error")),
        ],
        [matchers.call.fn(releaseServerCall), null],
        [matchers.call.fn(generateErrorToastOptions), errorToastOptions],
        [select(selectors.getTicketAction), TicketAction.release],
      ])
      .put(showToast(errorToastOptions))
      .run();
  });
  describe("upon purchase confirmation", () => {
    const purchaseReservation: Reservation = {
      id: 12345,
      showId: 54321,
      seatCount: 2,
      userId: 1,
      type: TicketAction.purchase,
    };
    const purchasePayload: PurchasePayload = {
      purchaseReservation,
      holdReservation,
    };
    const abortAction = startTicketAbort({
      reservation: holdReservation,
      reason: "test abort!",
    });

    test("cancels purchase call if aborted after confirmation", () => {
      const cancelSource = axios.CancelToken.source();
      return expectSaga(purchaseTickets, purchasePayload, cancelSource)
        .provide([
          [matchers.call.fn(reserveTicketServerCall), null],
          [matchers.call.fn(releaseServerCall), null],
          [matchers.call.fn(cancelPurchaseServerCall), null],
          {
            race: () => ({ abort: abortAction }),
          },
        ])
        .call.fn(cancelSource.cancel)
        .call.fn(releaseServerCall)
        .call.fn(cancelPurchaseServerCall)
        .not.put(
          showToast({
            title: "tickets purchased",
            status: "success",
          })
        )
        .put(showToast({ title: "purchase canceled", status: "warning" }))
        .put(resetTransaction())
        .run();
    });
    test("sends purchase call, cancels hold and ends ticket transaction if not aborted", () => {
      const cancelSource = axios.CancelToken.source();
      return expectSaga(ticketFlow, holdAction)
        .provide([
          [matchers.call.fn(reserveTicketServerCall), null],
          [matchers.call.fn(releaseServerCall), null],
        ])
        .dispatch(startTicketPurchase(purchasePayload))
        .call.fn(releaseServerCall)
        .not.call.fn(cancelSource.cancel)
        .not.call.fn(cancelPurchaseServerCall)
        .put(
          showToast({
            title: "tickets purchased",
            status: "success",
          })
        )
        .not.put(showToast({ title: "purchase canceled", status: "warning" }))
        .put(endTransaction())
        .run();
    });
  });
  describe("upon purchase cancellation", () => {
    test.each([
      { name: "cancel", actionCreator: startTicketRelease },
      { name: "abort", actionCreator: startTicketAbort },
      // object properties in test name won't work until https://github.com/facebook/jest/pull/11388 is released
    ])(
      "cancels hold and resets ticket transaction on $name",
      async ({ actionCreator }) => {
        await expectSaga(ticketFlow, holdAction)
          .provide([
            [matchers.call.fn(reserveTicketServerCall), null],
            [matchers.call.fn(releaseServerCall), null],
          ])
          .dispatch(
            actionCreator({ reservation: holdReservation, reason: "test" })
          )
          .call.fn(releaseServerCall)
          .not.call.fn(cancelPurchaseServerCall)
          .put(showToast({ title: "test", status: "warning" }))
          .put(resetTransaction())
          .run();
      }
    );
  });
});
