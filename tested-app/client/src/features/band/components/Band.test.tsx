import { App } from "../../../App";
import { render, screen } from "../../../test-utils";

test("band page displays data for bandId", async () => {
  render(<App />, { routeHistory: ["/bands/0"] });
  const heading = await screen.findByRole("heading", {
    name: "Avalanche of Cheese",
  });
  expect(heading).toBeInTheDocument();

  // more tests here
});
