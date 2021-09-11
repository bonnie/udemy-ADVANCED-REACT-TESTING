import { App } from "../../../App";
import { fireEvent, render, screen } from "../../../test-utils";
import { NavBar } from "./NavBar";

describe("sign-in button navigation", () => {
  test("Clicking sign-in button pushes '/signin' to history", () => {
    const { history } = render(<NavBar />);

    const signInButton = screen.getByRole("button", { name: /sign in/i });
    fireEvent.click(signInButton);

    expect(history.location.pathname).toBe("/signin");
  });

  test("Clicking sign-in button shows sign-in page", () => {
    render(<App />);

    const signInButton = screen.getByRole("button", { name: /sign in/i });
    fireEvent.click(signInButton);

    expect(
      screen.getByRole("heading", { name: /Sign in to your account/i })
    ).toBeInTheDocument();
  });
});

describe("display when signed in / not signed in", () => {
  test("display Sign In button when user is falsy", () => {
    render(<NavBar />);

    expect(
      screen.getByRole("button", { name: /sign in/i })
    ).toBeInTheDocument();
  });

  test("display Sign Out button and user email when user is truthy", () => {
    const userDetails = {
      email: "test@test.com",
    };
    render(<NavBar />, { preloadedState: { user: { userDetails } } });

    expect(
      screen.getByRole("button", { name: /sign out/i })
    ).toBeInTheDocument();
    expect(screen.getByText(/test@test.com/)).toBeInTheDocument();
  });
});
