import dayjs from "dayjs";

export function formatDate(dateToFormat: Date): string {
  return dayjs(dateToFormat).format("YYYY MMM D").toLowerCase();
}

export function generateRandomId(): number {
  return Math.floor(Math.random() * 100000000);
}
