import { all } from "redux-saga/effects";

import { signInFlow } from "../../../features/auth/redux/signInSaga";
import { watchTicketHolds } from "../../../features/tickets/redux/ticketSaga";
import { watchToasts } from "../../../features/toast/redux/logErrorToastSaga";

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export function* rootSaga() {
  yield all([signInFlow(), watchTicketHolds(), watchToasts()]);
}
