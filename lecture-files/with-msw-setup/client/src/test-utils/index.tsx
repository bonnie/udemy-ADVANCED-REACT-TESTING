import {
  render as rtlRender,
  RenderOptions,
  RenderResult,
} from "@testing-library/react";
import { createMemoryHistory, MemoryHistory } from "history";
import { ReactElement } from "react";
import { Provider } from "react-redux";
import { Router } from "react-router";

import { configureStoreWithMiddlewares, RootState } from "../app/store";

type CustomRenderOptions = {
  preloadedState?: RootState;
  routeHistory?: Array<string>;
  initialRouteIndex?: number;
  renderOptions?: Omit<RenderOptions, "wrapper">;
};

type CustomRenderResult = RenderResult & { history: MemoryHistory };

function render(
  ui: ReactElement,
  {
    preloadedState = {},
    routeHistory,
    initialRouteIndex,
    ...renderOptions
  }: CustomRenderOptions = {}
): CustomRenderResult {
  const history = createMemoryHistory({
    initialEntries: routeHistory,
    initialIndex: initialRouteIndex,
  });
  const Wrapper: React.FC = ({ children }) => {
    const store = configureStoreWithMiddlewares(preloadedState);
    return (
      <Provider store={store}>
        <Router history={history}>{children}</Router>
      </Provider>
    );
  };
  const rtlRenderObject = rtlRender(ui, { wrapper: Wrapper, ...renderOptions });
  return { ...rtlRenderObject, history };
}

export * from "@testing-library/react";
export { render };
