import { axiosInstance } from "../../../app/axios";
import { endpoints } from "../../../app/axios/constants";
import { clearItem, getItem, storeItem } from "../../../app/utils/storage";
import { LoggedInUser, SignInDetails } from "../types";

const LOCALSTORAGE_USER_KEY = "tickets-user";

export const authServerCall = async ({
  email,
  password,
  action,
}: SignInDetails): Promise<LoggedInUser | null> => {
  // to give a chance to navigate away!
  // await new Promise((r) => setTimeout(r, 5000));

  const { data, status } = await axiosInstance({
    url: endpoints[action],
    method: "POST",
    data: { email, password },
    headers: { "Content-Type": "application/json" },
    validateStatus: (code) => {
      return code === 400 || (code >= 200 && code < 300);
    },
  });

  if (status === 400) {
    throw new Error(data.message);
  }

  if (!data?.user?.token) {
    throw new Error(
      `Could not authenticate: no token received. ${data.message}`
    );
  }

  return data.user;
};

export const setStoredUser = (user: LoggedInUser): void => {
  storeItem(LOCALSTORAGE_USER_KEY, JSON.stringify(user));
};

export const clearStoredUser = (): void => {
  clearItem(LOCALSTORAGE_USER_KEY);
};

export const getStoredUser = (): LoggedInUser | null => {
  const storedUser = getItem(LOCALSTORAGE_USER_KEY);
  return storedUser ? JSON.parse(storedUser) : null;
};
