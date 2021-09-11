/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-param-reassign */
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import {
  HoldReservation,
  PurchaseReservation,
  Reservation,
} from "../../../../../shared/types";
import { RootState } from "../../../app/store";
import { TicketAction, TransactionStatus } from "../types";

export type ErrorPayload = { error: string };
export type ReleasePayload = { reservation: HoldReservation; reason: string };
export type PurchasePayload = {
  purchaseReservation: PurchaseReservation;
  holdReservation: HoldReservation;
};
export type TicketState = {
  action: TicketAction | null;
  transactionStatus: TransactionStatus;
};

const createTicketSlice = (initialState: TicketState) =>
  createSlice({
    name: "tickets",
    initialState,
    reducers: {
      holdTickets: (state, action: PayloadAction<Reservation>) => {
        state.transactionStatus = TransactionStatus.inProgress;
      },
      startTicketRelease: (state, action: PayloadAction<ReleasePayload>) => {
        state.action = TicketAction.release;
      },
      startTicketPurchase: (state, action: PayloadAction<PurchasePayload>) => {
        state.action = TicketAction.purchase;
      },
      startTicketAbort: (state, action: PayloadAction<ReleasePayload>) => {
        state.transactionStatus = TransactionStatus.idle;
      },
      endTransaction: (state) => {
        state.action = null;
        state.transactionStatus = TransactionStatus.completed;
      },
      resetTransaction: (state) => {
        state.action = null;
        state.transactionStatus = TransactionStatus.idle;
      },
    },
  });

const ticketSlice = createTicketSlice({
  action: null,
  transactionStatus: TransactionStatus.idle,
});

export const selectors = {
  getTicketAction: (state: RootState): TicketAction => state.tickets.action,
};

export const {
  holdTickets,
  startTicketPurchase,
  startTicketRelease,
  endTransaction,
  resetTransaction,
  startTicketAbort,
} = ticketSlice.actions;
export default ticketSlice.reducer;
