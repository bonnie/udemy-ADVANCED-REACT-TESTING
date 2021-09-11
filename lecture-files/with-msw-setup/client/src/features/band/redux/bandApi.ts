import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

import { Band } from "../../../../../shared/types";
import { baseUrl } from "../../../app/axios/constants";

export const bandUrl = `${baseUrl}/bands`;

export const bandApi = createApi({
  reducerPath: "bandApi",
  baseQuery: fetchBaseQuery({ baseUrl: bandUrl }),
  endpoints: (builder) => ({
    getBandById: builder.query<Band, string>({
      query: (bandId) => bandId,
      transformResponse: (data: { band: Band }) => data.band,
    }),
  }),
});

export const { useGetBandByIdQuery } = bandApi;
