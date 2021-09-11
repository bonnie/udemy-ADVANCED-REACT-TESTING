import { rest } from "msw";

import { showsUrl } from "../features/tickets/redux/showApi";
import { shows } from "../test-utils/fake-data";

export const handlers = [
  rest.get(showsUrl, (req, res, ctx) => {
    return res(ctx.json({ shows }));
  }),
];
