import { PayloadAction } from "@reduxjs/toolkit";
import { SagaIterator } from "redux-saga";
import { put, takeEvery } from "redux-saga/effects";

import { ToastOptions } from "../types";
import { showFriendlyToast, showToast } from "./toastSlice";

export function* makeFriendlyToast({
  payload,
}: PayloadAction<ToastOptions>): SagaIterator {
  const { title, status } = payload;
  const friendlyTitle = `Hi! ${title}`;
  yield put(showToast({ title: friendlyTitle, status }));
}

// not very useful, didn't even bother to add to root saga
export function* watchFriendlyToast(): SagaIterator {
  yield takeEvery(showFriendlyToast.type, makeFriendlyToast);
}
