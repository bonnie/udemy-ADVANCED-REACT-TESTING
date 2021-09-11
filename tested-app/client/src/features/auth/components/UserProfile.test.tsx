import { App } from "../../../App";
import { render, screen } from "../../../test-utils";
import { UserProfile } from "./UserProfile";

const fakeUser = {
  name: "Tess Q. User",
  email: "test@test.com",
};

test("User profile shows name and email", () => {
  render(<UserProfile />, {
    preloadedState: { user: { userDetails: fakeUser } },
  });
  expect(screen.getByText(/test@test.com/)).toBeInTheDocument();
});

test("User profile redirects to signin if not logged in", () => {
  const { history } = render(<UserProfile />, {
    preloadedState: { user: null },
  });
  expect(screen.queryByText(/test@test.com/)).not.toBeInTheDocument();
  expect(history.location.pathname).toBe("/signin");
});

test("FUNCTIONAL: User profile redirects to signin if not logged in", () => {
  render(<App />, {
    preloadedState: { user: null },
    routeHistory: ["/profile"],
  });
  expect(screen.queryByText(/test@test.com/)).not.toBeInTheDocument();
  expect(
    screen.getByRole("heading", { name: /Sign in to your account/i })
  ).toBeInTheDocument();
});
