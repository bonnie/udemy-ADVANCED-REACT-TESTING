import { Route, Switch } from "react-router-dom";

import { PrivateRoute } from "../../../features/auth/components/PrivateRoute";
import { SignIn } from "../../../features/auth/components/SignIn";
import { UserProfile } from "../../../features/auth/components/UserProfile";
import { Band } from "../../../features/band/components/Band";
import { Confirm } from "../../../features/tickets/components/Confirm";
import { Shows } from "../../../features/tickets/components/Shows";
import { Tickets } from "../../../features/tickets/components/Tickets";
import { Home } from "../Home";

export function Routes(): React.ReactElement {
  return (
    <Switch>
      <Route path="/signIn">
        <SignIn />
      </Route>
      <Route path="/shows">
        <Shows />
      </Route>
      <Route path="/bands/:bandId">
        <Band />
      </Route>
      <PrivateRoute path="/tickets/:showId">
        <Tickets />
      </PrivateRoute>
      <PrivateRoute path="/confirm/:showId">
        <Confirm />
      </PrivateRoute>
      <PrivateRoute path="/profile">
        <UserProfile />
      </PrivateRoute>
      <Route path="/">
        <Home />
      </Route>
    </Switch>
  );
}
