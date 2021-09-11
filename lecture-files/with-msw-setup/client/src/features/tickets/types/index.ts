// must repeat this here (in addition to shared types) as enums
// can't be imported from outside src
export enum TicketAction {
  hold = "hold",
  purchase = "purchase",
  release = "release",
  cancelPurchase = "cancel purchase",
}

export enum TransactionStatus {
  idle = "idle",
  inProgress = "in progress",
  completed = "completed",
}
