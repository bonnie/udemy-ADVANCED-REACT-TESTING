import dayjs from "dayjs";

import {
  Band,
  HoldReservation,
  PurchaseReservation,
  Show,
} from "../../../shared/types";
import { PurchasePayload } from "../features/tickets/redux/ticketSlice";
import { TicketAction } from "../features/tickets/types";

export const holdReservation: HoldReservation = {
  id: 12345,
  showId: 54321,
  seatCount: 2,
  userId: 1,
  type: TicketAction.hold,
};

export const purchaseReservation: PurchaseReservation = {
  id: 12345,
  showId: 54321,
  seatCount: 2,
  userId: 1,
  type: TicketAction.purchase,
};

export const purchasePayload: PurchasePayload = {
  purchaseReservation,
  holdReservation,
};

export const bands: Array<Band> = [
  {
    id: 0,
    name: "Avalanche of Cheese",
    description: "rollicking country with ambitious kazoo solos",
    image: {
      fileName: "band13.jpg",
      authorName: "Chang Duong",
      authorLink: "https://unsplash.com/@iamchang",
    },
  },
  {
    id: 1,
    name: "The Joyous Nun Riot",
    description: "serious world music with an iconic musical saw",
    image: {
      fileName: "band7.jpg",
      authorName: "Dominik Vanyi",
      authorLink: "https://unsplash.com/@dominik_photography",
    },
  },
];

export const shows: Array<Show> = [
  {
    id: 0,
    scheduledAt: dayjs().add(1, "days").toDate(),
    availableSeatCount: 308,
    band: bands[0],
  },
  {
    id: 1,
    scheduledAt: dayjs().add(2, "days").toDate(),
    availableSeatCount: 0, // sold out
    band: bands[1],
  },
];
