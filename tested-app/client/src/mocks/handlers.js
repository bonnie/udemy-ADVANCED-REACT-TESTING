import { rest } from "msw";

import { baseUrl, endpoints } from "../app/axios/constants";
import { bandUrl } from "../features/band/redux/bandApi";
import { showsUrl } from "../features/tickets/redux/showApi";
import { fakeBands, fakeShows } from "../test-utils/fake-data";

const authHandler = (req, res, ctx) => {
  const { email } = req.body;
  const user = { email, token: "abc", id: 1 };
  return res(ctx.json({ user }));
};

export const handlers = [
  rest.get(showsUrl, (req, res, ctx) => {
    return res(ctx.json({ shows: fakeShows }));
  }),
  rest.get(`${showsUrl}/:showId`, (req, res, ctx) => {
    const { showId } = req.params;
    // showId is conveniently its index in the array
    return res(ctx.json({ show: fakeShows[showId] }));
  }),
  rest.get(`${bandUrl}/:bandId`, (req, res, ctx) => {
    const { bandId } = req.params;
    // bandId is conveniently its index in the array
    return res(ctx.json({ band: fakeBands[bandId] }));
  }),
  rest.patch(`${showsUrl}/:showId/:action/:actionId`, (req, res, ctx) => {
    return res(ctx.status(200));
  }),
  rest.post(`${baseUrl}/${endpoints.signIn}`, authHandler),
  rest.post(`${baseUrl}/${endpoints.signUp}`, authHandler),
];
