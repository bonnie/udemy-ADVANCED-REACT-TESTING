/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable react/require-default-props */
import {
  render as rtlRender,
  RenderOptions,
  RenderResult,
} from "@testing-library/react";
import {
  createMemoryHistory,
  MemoryHistory,
  MemoryHistoryBuildOptions,
} from "history";
import { ReactElement, ReactNode } from "react";
import { Provider } from "react-redux";
import { Router } from "react-router-dom";

import { configureStoreWithMiddlewares, RootState } from "../app/store";

type CustomRenderOptions = {
  preloadedState?: RootState;
  routeHistory?: Array<string>;
  initialRouteIndex?: number; // index in the routeHistory array to start the test
  renderOptions?: Omit<RenderOptions, "wrapper">;
};

type CustomRenderResult = RenderResult & { history: MemoryHistory };

function render(
  ui: ReactElement,
  {
    preloadedState = {},
    routeHistory = [],
    initialRouteIndex,
    ...renderOptions
  }: CustomRenderOptions = {}
): CustomRenderResult {
  const memoryHistoryArgs: MemoryHistoryBuildOptions = {};
  if (routeHistory.length > 0) {
    memoryHistoryArgs.initialEntries = routeHistory;
    memoryHistoryArgs.initialIndex = initialRouteIndex;
  }
  const history = createMemoryHistory({ ...memoryHistoryArgs });
  function Wrapper({ children }: { children?: ReactNode }): ReactElement {
    const store = configureStoreWithMiddlewares(preloadedState);

    return (
      <Provider store={store}>
        <Router history={history}>{children}</Router>
      </Provider>
    );
  }

  const renderResult = rtlRender(ui, { wrapper: Wrapper, ...renderOptions });
  return { ...renderResult, history };
}

// re-export everything
export * from "@testing-library/react";

// override render method and export history
export { render };
