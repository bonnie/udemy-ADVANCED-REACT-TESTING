import { expectSaga } from "redux-saga-test-plan";

import { ToastOptions } from "../types";
import { makeFriendlyToast } from "./friendlyToastSaga";
import { startToast } from "./toastSlice";

const friendlyToastPayload: ToastOptions = {
  title: "you're great",
  status: "info",
};

const friendlyToastAction = {
  type: "test", // not important to the makeFriendlyToast saga
  payload: friendlyToastPayload,
};

test("adds greeting before toast title", () => {
  return expectSaga(makeFriendlyToast, friendlyToastAction)
    .put(startToast({ title: "Hi! you're great", status: "info" }))
    .run();
});
