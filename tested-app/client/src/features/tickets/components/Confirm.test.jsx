import { App } from "../../../App";
import { render } from "../../../test-utils";
import { TransactionStatus } from "../types";
import { Confirm } from "./Confirm";

test("redirect to /shows when transaction is completed", () => {
  const { history } = render(<Confirm />, {
    preloadedState: {
      user: { userDetails: { email: "test@test.com" } },
      tickets: { transactionStatus: TransactionStatus.completed },
    },
  });

  expect(history.location.pathname).toBe("/shows");
});

test("redirect to /tickets/:showId if seatCount is missing", () => {
  const { history } = render(<App />, {
    routeHistory: ["/confirm/0?holdId=12345"],
    preloadedState: {
      // otherwise redirected to signin!
      user: { userDetails: { email: "test@test.com" } },
    },
  });
  expect(history.location.pathname).toBe("/tickets/0");
});
