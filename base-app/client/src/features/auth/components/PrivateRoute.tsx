// adapted from https://reactrouter.com/web/example/auth-workflow
import React from "react";
import { RouteProps } from "react-router";
import { Redirect, Route } from "react-router-dom";

import { useUser } from "../hooks/useUser";

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export function PrivateRoute({
  children,
  ...rest
}: React.PropsWithChildren<RouteProps>): React.ReactElement {
  const { user } = useUser();

  return (
    <Route
      // eslint-disable-next-line react/jsx-props-no-spreading
      {...rest}
      render={({ location }: { location: Location }) =>
        user ? (
          children
        ) : (
          <Redirect
            to={{
              pathname: "/signin",
              state: { from: location },
            }}
          />
        )
      }
    />
  );
}
