export interface Id {
  id: number;
}

export interface NewUser {
  email: string;
  name?: string;
  address?: string;
  phone?: string;
  token?: string;
}

export type User = Id & NewUser;

export interface ShowWithoutAvailableSeatCount {
  id: number
  band: Band
  scheduledAt: Date
}

export interface availableSeatCount {
  availableSeatCount: number;
}

export type Show = ShowWithoutAvailableSeatCount & availableSeatCount;

export enum TicketAction {
  hold="hold",
  purchase="purchase",
  release="release",
  cancelPurchase="cancel purchase"
}

export interface ReservationBase {
  id: number
  showId: number
  userId: number
  seatCount: number
}

export interface Reservation extends ReservationBase {
  type: TicketAction
}

export interface HoldReservation extends ReservationBase {
  type: TicketAction.hold
}

export interface PurchaseReservation extends ReservationBase {
  type: TicketAction.purchase
}

export interface Band {
  id: number
  name: string
  description: string
  image: Image
}
export interface Image {
  fileName: string;
  authorName: string;
  authorLink: string;
}
