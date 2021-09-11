import { App } from "../../../App";
import { fireEvent, render, screen } from "../../../test-utils";

test("tickets page displays band data for showId", async () => {
  render(<App />, {
    preloadedState: { user: { userDetails: { email: "test@test.com" } } },
    routeHistory: ["/tickets/0"],
  });
  const heading = await screen.findByRole("heading", {
    name: "Avalanche of Cheese",
  });
  expect(heading).toBeInTheDocument();

  // more tests here
});

// TODO: network error!!!
test("'ticket' button click pushes correct URL", async () => {
  const { history } = render(<App />, {
    // the non-sold-out show has id 0
    routeHistory: ["/tickets/0"],
    preloadedState: { user: { userDetails: { email: "test@test.com" } } },
  });

  const purchaseButton = await screen.findByRole("button", {
    name: /purchase/i,
  });
  fireEvent.click(purchaseButton);

  expect(history.location.pathname).toEqual("/confirm/0");

  const searchRegex = expect.stringMatching(/holdId=\d+&seatCount=2/);
  expect(history.location.search).toEqual(searchRegex);
});
