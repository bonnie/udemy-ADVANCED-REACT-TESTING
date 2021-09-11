import { PayloadAction } from "@reduxjs/toolkit";
import { SagaIterator } from "redux-saga";
import { call, put, takeEvery } from "redux-saga/effects";

import { ToastOptions } from "../types";
import { showToast, startToast } from "./toastSlice";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const sendToAnalytics = (title: string): void => {
  // presumably this would send the event to some analytics engine
};

export function* logErrorToast({
  payload,
}: PayloadAction<ToastOptions>): SagaIterator {
  const { title, status } = payload;
  if (status === "error") {
    yield call(sendToAnalytics, title);
  }
  yield put(showToast({ title, status }));
}

export function* watchToasts(): SagaIterator {
  yield takeEvery(startToast.type, logErrorToast);
}
