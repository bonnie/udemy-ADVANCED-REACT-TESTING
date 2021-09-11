import dayjs from "dayjs";

import { Band, Show } from "../../../shared/types";

export const fakeBands: Array<Band> = [
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
    description: "serious a capella with an iconic musical saw",
    image: {
      fileName: "band7.jpg",
      authorName: "Dominik Vanyi",
      authorLink: "https://unsplash.com/@dominik_photography",
    },
  },
];

export const fakeShows: Array<Show> = [
  {
    id: 0,
    scheduledAt: dayjs().add(1, "days").toDate(),
    availableSeatCount: 308,
    band: fakeBands[0],
  },
  {
    id: 1,
    scheduledAt: dayjs().add(2, "days").toDate(),
    availableSeatCount: 0, // sold out
    band: fakeBands[1],
  },
];
