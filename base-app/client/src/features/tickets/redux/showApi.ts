import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import dayjs from "dayjs";

import { Show } from "../../../../../shared/types";
import { baseUrl } from "../../../app/axios/constants";

export const showsUrl = `${baseUrl}/shows`;

export const showApi = createApi({
  reducerPath: "showApi",
  baseQuery: fetchBaseQuery({ baseUrl: showsUrl }),
  endpoints: (builder) => ({
    getAllShows: builder.query<Array<Show>, null>({
      query: () => "",
      transformResponse: (data: { shows: Array<Show> }) => {
        const today = dayjs();
        return data.shows.filter((show) => dayjs(show.scheduledAt) >= today);
      },
    }),
    getShowById: builder.query<Show, string>({
      query: (showId) => showId,
      transformResponse: (data: { show: Show }) => data.show,
    }),
  }),
});

export const { useGetAllShowsQuery, useGetShowByIdQuery } = showApi;
