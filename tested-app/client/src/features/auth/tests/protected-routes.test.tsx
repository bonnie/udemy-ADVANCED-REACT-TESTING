/* eslint-disable @typescript-eslint/no-explicit-any */
import userEvent from "@testing-library/user-event";
import {
  DefaultRequestBody,
  RequestParams,
  ResponseComposition,
  rest,
  RestContext,
  RestRequest,
} from "msw";

import { App } from "../../../App";
import { baseUrl, endpoints } from "../../../app/axios/constants";
import { server } from "../../../mocks/server";
import { getByRole, render, screen, waitFor } from "../../../test-utils";

test.each([
  { route: "/profile" },
  { route: "/tickets/0" },
  { route: "/confirm/0?holdId=123&seatCount=2" },
])(
  // object properties in test name won't work until https://github.com/facebook/jest/pull/11388 is released
  "$route redirects to sign-in from /profile when not authenticated",
  ({ route }) => {
    render(<App />, { routeHistory: [route] });
    const signInHeader = screen.getByRole("heading", { name: /sign/i });
    expect(signInHeader).toBeInTheDocument();
  }
);

// code quiz solution, not necessary with parametrized test below
// test("successful sign-up flow", async () => {
//   // Go to protected page
//   const { history } = render(<App />, { routeHistory: ["/tickets/0"] });

//   // Sign in (after redirect)
//   const emailField = screen.getByLabelText(/email address/i);
//   userEvent.type(emailField, "test@test.com");

//   const passwordField = screen.getByLabelText(/password/i);
//   userEvent.type(passwordField, "test");

//   const form = screen.getByTestId("sign-in-form");
//   const signInButton = getByRole(form, "button", { name: /sign up/i });
//   userEvent.click(signInButton);

//   await waitFor(() => {
//     // Test for redirect back to initial protected page
//     expect(history.location.pathname).toBe("/tickets/0");

//     // with sign-in page removed from history
//     expect(history.length).toBe(1);
//   });
// });

test.each([
  { testName: "sign in", buttonName: /sign in/i },
  { testName: "sign up", buttonName: /sign up/i },
])("successful $testName flow", async ({ buttonName }) => {
  // Go to protected page
  const { history } = render(<App />, { routeHistory: ["/tickets/0"] });

  // Sign in (after redirect)
  const emailField = screen.getByLabelText(/email address/i);
  userEvent.type(emailField, "test@test.com");

  const passwordField = screen.getByLabelText(/password/i);
  userEvent.type(passwordField, "test");

  const form = screen.getByTestId("sign-in-form");
  const signInButton = getByRole(form, "button", { name: buttonName });
  userEvent.click(signInButton);

  await waitFor(() => {
    // Test for redirect back to initial protected page
    expect(history.location.pathname).toBe("/tickets/0");

    // with sign-in page removed from history
    expect(history.length).toBe(1);
  });
});

const signInFailure = (
  req: RestRequest<DefaultRequestBody, RequestParams>,
  res: ResponseComposition<any>,
  ctx: RestContext
) => {
  return res(ctx.status(401));
};
const serverError = (
  req: RestRequest<DefaultRequestBody, RequestParams>,
  res: ResponseComposition<any>,
  ctx: RestContext
) => {
  return res(ctx.status(500));
};
const signUpFailure = (
  req: RestRequest<DefaultRequestBody, RequestParams>,
  res: ResponseComposition<any>,
  ctx: RestContext
) => {
  return res(ctx.status(400), ctx.json({ message: "Email is already in use" }));
};

// code quiz solution, not necessary with parametrized test below
// test("sign in server error followed by successful signin", async () => {
//   // reset the handler to respond as though signin failed
//   const errorHandler = rest.post(`${baseUrl}/${endpoints.signIn}`, serverError);
//   server.resetHandlers(errorHandler);

//   const { history } = render(<App />, { routeHistory: ["/tickets/0"] });

//   // Sign in (after redirect)
//   const emailField = screen.getByLabelText(/email address/i);
//   userEvent.type(emailField, "test@test.com");

//   const passwordField = screen.getByLabelText(/password/i);
//   userEvent.type(passwordField, "test");

//   const form = screen.getByTestId("sign-in-form");
//   const signInButton = getByRole(form, "button", { name: /sign in/i });
//   userEvent.click(signInButton);

//   // reset handlers to default to simulate a correct sign-in
//   server.resetHandlers();

//   // no need to re-enter info, just click button
//   userEvent.click(signInButton);

//   await waitFor(() => {
//     // Test for redirect back to initial protected page
//     expect(history.location.pathname).toBe("/tickets/0");

//     // with sign-in page removed from history
//     expect(history.length).toBe(1);
//   });
// });

test.each([
  {
    endpoint: endpoints.signIn,
    outcome: "failure",
    responseResolver: signInFailure,
    buttonNameRegex: /sign in/i,
  },
  {
    endpoint: endpoints.signIn,
    outcome: "server error",
    responseResolver: serverError,
    buttonNameRegex: /sign in/i,
  },
  {
    endpoint: endpoints.signUp,
    outcome: "failure",
    responseResolver: signUpFailure,
    buttonNameRegex: /sign up/i,
  },
  {
    endpoint: endpoints.signUp,
    outcome: "error",
    responseResolver: serverError,
    buttonNameRegex: /sign in/i,
  },
])(
  "$endpoint $outcome followed by successful signin",
  async ({ endpoint, responseResolver, buttonNameRegex }) => {
    // reset the handler to respond as though signin failed
    const errorHandler = rest.post(`${baseUrl}/${endpoint}`, responseResolver);
    server.resetHandlers(errorHandler);

    const { history } = render(<App />, { routeHistory: ["/tickets/0"] });

    // Sign in (after redirect)
    const emailField = screen.getByLabelText(/email address/i);
    userEvent.type(emailField, "test@test.com");

    const passwordField = screen.getByLabelText(/password/i);
    userEvent.type(passwordField, "test");

    const form = screen.getByTestId("sign-in-form");
    const signInButton = getByRole(form, "button", { name: buttonNameRegex });
    userEvent.click(signInButton);

    // reset handlers to default to simulate a correct sign-in
    server.resetHandlers();

    // no need to re-enter info, just click button
    userEvent.click(signInButton);

    await waitFor(() => {
      // Test for redirect back to initial protected page
      expect(history.location.pathname).toBe("/tickets/0");

      // with sign-in page removed from history
      expect(history.length).toBe(1);
    });
  }
);
