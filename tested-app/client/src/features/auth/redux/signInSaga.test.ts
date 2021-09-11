import { createMockTask } from "@redux-saga/testing-utils";
import { expectSaga, testSaga } from "redux-saga-test-plan";
import * as matchers from "redux-saga-test-plan/matchers";
import { throwError } from "redux-saga-test-plan/providers";

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
import { authenticateUser, signInFlow } from "./signInSaga";

const sleep = (delay: number): Promise<void> =>
  new Promise((resolve) => setTimeout(resolve, delay));

const userResponse: LoggedInUser = {
  email: "bookings@avalancheOfCheese.com",
  id: 123,
  userToken: "i got the power",
};

const signInPayload: SignInDetails = {
  email: "bookings@avalancheOfCheese.com",
  password: "swissCheddarGouda4me",
  action: "signIn",
};

const signUpPayload: SignInDetails = {
  email: "bookings@avalancheOfCheese.com",
  password: "swissCheddarGouda4me",
  action: "signUp",
};

describe("signInFlow saga", () => {
  test("successful sign-in", () => {
    return expectSaga(signInFlow)
      .provide([[matchers.call.fn(authServerCall), userResponse]])
      .dispatch(signInRequest(signInPayload))
      .call(authServerCall, signInPayload)
      .put.actionType(startSignIn.type)
      .put.actionType(signIn.type)
      .put.actionType(showToast.type)
      .put(endSignIn())
      .silentRun(25);
  });
  test("successful sign-up", () => {
    return expectSaga(signInFlow)
      .provide([[matchers.call.fn(authServerCall), userResponse]])
      .dispatch(signInRequest(signUpPayload))
      .call(authServerCall, signUpPayload)
      .put.actionType(startSignIn.type)
      .put.actionType(signIn.type)
      .put.actionType(showToast.type)
      .put(endSignIn())
      .silentRun(25);
  });
  test("canceled sign-in", () => {
    return expectSaga(signInFlow)
      .provide({
        call: async (effect, next) => {
          if (effect.fn === authServerCall) {
            await sleep(500);
          }
          return next();
        },
      })
      .dispatch(signInRequest(signInPayload))
      .dispatch(cancelSignIn())
      .put(showToast({ title: "Sign in canceled", status: "warning" }))
      .put(signOut())
      .put(endSignIn())
      .silentRun(25);
  });
  test("sign-in error", () => {
    return expectSaga(signInFlow)
      .provide([
        [matchers.call.fn(authServerCall), throwError(new Error("uh oh"))],
      ])
      .dispatch(signInRequest(signInPayload))
      .put(
        showToast({
          title: "Sign in failed: uh oh",
          status: "warning",
        })
      )
      .put(endSignIn())
      .silentRun(25);
  });
});

// unit test for saga cancel, since .cancel doesn't work in integration
// https://github.com/jfairbank/redux-saga-test-plan/issues/359
test("saga cancel flow", () => {
  const task = createMockTask();
  const saga = testSaga(signInFlow);
  saga.next().take(signInRequest.type);
  saga
    .next({ type: "test", payload: signInPayload })
    .fork(authenticateUser, signInPayload);
  saga.next(task).take([cancelSignIn.type, endSignIn.type]);
  saga.next(cancelSignIn()).cancel(task);
});

// unit test for non-cancel flow
test("saga non-cancel flow", () => {
  const task = createMockTask();
  const saga = testSaga(signInFlow);
  saga.next().take(signInRequest.type);
  saga
    .next({ type: "test", payload: signInPayload })
    .fork(authenticateUser, signInPayload);
  saga.next(task).take([cancelSignIn.type, endSignIn.type]);
  saga.next(endSignIn()).take(signInRequest.type);
});
