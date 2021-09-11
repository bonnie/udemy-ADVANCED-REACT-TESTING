// adapted from https://redux-saga.js.org/docs/advanced/NonBlockingCalls/
import { SagaIterator } from "redux-saga";
import { call, cancel, cancelled, fork, put, take } from "redux-saga/effects";

import { showToast } from "../../toast/redux/toastSlice";
import { authServerCall } from "../api";
import { LoggedInUser, SignInDetails } from "../types";
import {
  cancelSignIn,
  endSignIn,
  signIn,
  signInRequest,
  signOut,
  startSignIn,
} from "./authSlice";

export function* authenticateUser(payload: SignInDetails): SagaIterator {
  try {
    yield put(startSignIn());
    const response: LoggedInUser = yield call(authServerCall, payload);
    yield put(signIn(response));
    yield put(
      showToast({
        title: `Signed in as ${response.email}`,
        status: "info",
      })
    );
  } catch (error) {
    const action = payload.action === "signIn" ? "in" : "up";
    yield put(
      showToast({
        title: `Sign ${action} failed: ${error.message}`,
        status: "warning",
      })
    );
  } finally {
    if (yield cancelled()) {
      yield put(showToast({ title: "Sign in canceled", status: "warning" }));
      yield put(signOut());
    }
    yield put(endSignIn());
  }
}

export function* signInFlow(): SagaIterator {
  while (true) {
    const { payload } = yield take(signInRequest.type);
    const signInTask = yield fork(authenticateUser, payload);

    // restart loop on cancelSignIn or endSignIn action
    const nextAction = yield take([cancelSignIn.type, endSignIn.type]);
    if (nextAction.type === cancelSignIn.type) yield cancel(signInTask);
  }
}
