import { PayloadAction } from "@reduxjs/toolkit";
import axios, { CancelTokenSource } from "axios";
import { SagaIterator } from "redux-saga";
import {
  call,
  cancel,
  cancelled,
  put,
  race,
  select,
  take,
  takeEvery,
} from "redux-saga/effects";

import { HoldReservation } from "../../../../../shared/types";
import { showToast } from "../../toast/redux/toastSlice";
import { ToastOptions } from "../../toast/types";
import {
  cancelPurchaseServerCall,
  releaseServerCall,
  reserveTicketServerCall,
} from "../api";
import { TicketAction } from "../types";
import {
  endTransaction,
  holdTickets,
  PurchasePayload,
  ReleasePayload,
  resetTransaction,
  selectors,
  startTicketAbort,
  startTicketPurchase,
  startTicketRelease,
} from "./ticketSlice";

export function generateErrorToastOptions(
  error: string,
  ticketAction: TicketAction
): ToastOptions {
  const titleIntro = ticketAction
    ? `Could not ${ticketAction} tickets`
    : "Ticket error";
  return {
    title: `${titleIntro}: ${error}`,
    status: "error",
  };
}

// cancel or abort after hold but before purchase has been initiated
function* releaseTickets(payload: ReleasePayload): SagaIterator {
  const { reservation, reason } = payload;
  yield put(showToast({ title: reason, status: "warning" }));
  yield call(cancelTransaction, reservation);
}

export function* cancelTransaction(
  holdReservation: HoldReservation
): SagaIterator {
  yield call(releaseServerCall, holdReservation);
  yield put(resetTransaction());
}

// after puchase has been initiated
export function* purchaseTickets(
  payload: PurchasePayload,
  cancelSource: CancelTokenSource
): SagaIterator {
  const { purchaseReservation, holdReservation } = payload;
  try {
    const { abort, purchaseResult } = yield race({
      purchaseResult: call(
        reserveTicketServerCall,
        purchaseReservation,
        cancelSource.token
      ),
      abort: take(startTicketAbort.type),
    });
    if (abort) {
      yield call(cancelSource.cancel);
      yield cancel();
    } else if (purchaseResult) {
      // result will only be truthy if there was an error
      const ticketAction = yield select(selectors.getTicketAction);
      const errorToastOptions = yield call(
        generateErrorToastOptions,
        purchaseResult,
        ticketAction
      );
      yield put(showToast(errorToastOptions));
      yield call(cancelTransaction, holdReservation);
    } else {
      yield put(showToast({ title: "tickets purchased", status: "success" }));
    }
  } catch (e) {
    yield call(cancelPurchaseServerCall, purchaseReservation);
    throw e;
  } finally {
    if (yield cancelled()) {
      yield call(cancelPurchaseServerCall, purchaseReservation);
      yield put(showToast({ title: "purchase canceled", status: "warning" }));
      yield call(cancelTransaction, holdReservation);
    } else {
      yield call(releaseServerCall, holdReservation);
      yield put(endTransaction());
    }
  }
}

// main flow after ticket hold has been initiated
export function* ticketFlow({
  payload: holdPayload,
}: PayloadAction<HoldReservation>): SagaIterator {
  try {
    yield call(reserveTicketServerCall, holdPayload);
    const nextAction = yield take([
      startTicketRelease.type, // hold expiration or cancel button
      startTicketAbort.type, // navigate away from page
      startTicketPurchase.type, // confirm button
    ]);
    if (nextAction.type === startTicketPurchase.type) {
      const cancelSource = axios.CancelToken.source();
      yield call(purchaseTickets, nextAction.payload, cancelSource);
    } else {
      yield call(releaseTickets, nextAction.payload);
    }
  } catch (error) {
    const ticketAction = yield select(selectors.getTicketAction);
    yield put(
      showToast(generateErrorToastOptions(error.message, ticketAction))
    );

    yield call(cancelTransaction, holdPayload);
  }
}

export function* watchTicketHolds(): SagaIterator {
  yield takeEvery(holdTickets.type, ticketFlow);
}
