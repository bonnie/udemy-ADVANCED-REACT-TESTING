import { AxiosRequestConfig, CancelToken } from "axios";

import {
  HoldReservation,
  PurchaseReservation,
  Reservation,
} from "../../../../../shared/types";
import { axiosInstance } from "../../../app/axios";
import { endpoints } from "../../../app/axios/constants";
import { TicketAction } from "../types";

export const reserveTicketServerCall = async (
  { showId, seatCount, userId, id: actionId, type: action }: Reservation,
  cancelToken: CancelToken | null = null
): Promise<void> => {
  const request: AxiosRequestConfig = {
    url: `${endpoints.shows}/${showId}/${action}/${actionId}`,
    method: "PATCH",
    data: { seatCount, userId },
    headers: { "Content-Type": "application/json" },
  };
  if (cancelToken) request.cancelToken = cancelToken;

  await axiosInstance(request);
};

export const releaseServerCall = async ({
  showId,
  id: actionId,
}: HoldReservation): Promise<void> => {
  await axiosInstance({
    url: `${endpoints.shows}/${showId}/${TicketAction.release}/${actionId}`,
    method: "PATCH",
  });
};

export const cancelPurchaseServerCall = async ({
  showId,
  id: purchaseId,
}: PurchaseReservation): Promise<void> => {
  await axiosInstance({
    url: `${endpoints.shows}/${showId}/${TicketAction.cancelPurchase}/${purchaseId}`,
    method: "PATCH",
  });
};
