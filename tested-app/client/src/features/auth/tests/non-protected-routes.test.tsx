import { App } from "../../../App";
import { render, screen } from "../../../test-utils";

test.each([
  [{ routeName: "Home", routePath: "/", headingMatch: /welcome/i }],
  [{ routeName: "Shows", routePath: "/shows", headingMatch: /shows/i }],
  [{ routeName: "Band 1", routePath: "/bands/1", headingMatch: /joyous/i }],
])(
  // object properties in test name won't work until https://github.com/facebook/jest/pull/11388 is released
  "$routeName page does not redirect to login screen",
  async ({ routePath, headingMatch }) => {
    render(<App />, { routeHistory: [routePath] });
    const heading = await screen.findByRole("heading", { name: headingMatch });
    expect(heading).toBeInTheDocument();
  }
);

// test.each([
//   ["Home", "/", /welcome/i],
//   ["Shows", "/shows", /shows/i],
//   ["Band 1", "/bands/1", /avalanche/i],
// ])(
//   "%s page does not redirect to login screen",
//   (routeName, routePath, headingMatch) => {
//     render(<App />, { routeHistory: [routePath] });
//     const heading = screen.getByRole("heading", { name: headingMatch });
//     expect(heading).toBeInTheDocument();
//   }
// );
