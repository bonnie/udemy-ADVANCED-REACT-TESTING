/* eslint-disable no-param-reassign */
import { createAction, createSlice, PayloadAction } from "@reduxjs/toolkit";

import { User } from "../../../../../shared/types";
import { RootState } from "../../../app/store";
import { clearStoredUser, getStoredUser, setStoredUser } from "../api";
import { LoggedInUser, SignInDetails, SignInStatus } from "../types";

export type AuthState = {
  userDetails?: LoggedInUser;
  signInStatus: SignInStatus;
};

const getInitialState = (): AuthState => {
  const initialState: AuthState = {
    signInStatus: "idle",
  };
  const storedUser = getStoredUser();
  if (storedUser) initialState.userDetails = storedUser;
  return initialState;
};

const createAuthSlice = (initialState: AuthState) =>
  createSlice({
    name: "user",
    initialState,
    reducers: {
      signIn: (state, action: PayloadAction<LoggedInUser>) => {
        // clear "pending" signInStatus so sign-in page can redirect without triggering cancelSignIn
        state.signInStatus = "idle";
        state.userDetails = action.payload;
        setStoredUser(action.payload);
      },
      signOut: (state) => {
        state.userDetails = undefined;
        clearStoredUser();
      },
      startSignIn: (state) => {
        state.signInStatus = "pending";
      },
      endSignIn: (state) => {
        state.signInStatus = "idle";
      },
    },
  });

export const signInRequest = createAction<SignInDetails>("signInRequest");
export const cancelSignIn = createAction("cancelSignIn");

export const selectors = {
  getUserDetails: (state: RootState): User | null => state.user.userDetails,
};

const initialState = getInitialState();
const authSlice = createAuthSlice(initialState);

export const { signIn, signOut, startSignIn, endSignIn } = authSlice.actions;
export default authSlice.reducer;
