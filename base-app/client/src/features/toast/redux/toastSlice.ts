/* eslint-disable no-param-reassign */
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import { ToastOptions } from "../types";

export type ToastState = {
  toastOptions: ToastOptions | null;
};

const createToastSlice = (initialState: ToastState) =>
  createSlice({
    name: "toast",
    initialState,
    reducers: {
      startToast(state, action: PayloadAction<ToastOptions>) {
        state.toastOptions = action.payload;
      },
      resetToast(state) {
        state.toastOptions = null;
      },
    },
  });

const toastSlice = createToastSlice({ toastOptions: null });
export const { startToast, resetToast } = toastSlice.actions;
export default toastSlice.reducer;
