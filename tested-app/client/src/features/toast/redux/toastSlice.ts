/* eslint-disable no-param-reassign */
import { createAction, createSlice, PayloadAction } from "@reduxjs/toolkit";

import { ToastOptions } from "../types";

export type ToastState = {
  toastOptions: ToastOptions | null;
};

const createToastSlice = (initialState: ToastState) =>
  createSlice({
    name: "toast",
    initialState,
    reducers: {
      showToast(state, action: PayloadAction<ToastOptions>) {
        state.toastOptions = action.payload;
      },
      resetToast(state) {
        state.toastOptions = null;
      },
    },
  });

export const showFriendlyToast =
  createAction<ToastOptions>("showPersonalToast");

const toastSlice = createToastSlice({ toastOptions: null });
export const { showToast, resetToast } = toastSlice.actions;
export default toastSlice.reducer;
