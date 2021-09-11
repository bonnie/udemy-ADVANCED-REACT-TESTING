import { User } from "../../../../../shared/types";

export type AuthenticateAction = "signIn" | "signUp";

export type SignInStatus = "idle" | "pending";

export type LoggedInUser = {
  userToken?: string;
} & User;

export interface SignInDetails {
  email: string;
  password: string;
  action: AuthenticateAction;
}
