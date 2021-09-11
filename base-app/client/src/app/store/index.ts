import {
  Action,
  configureStore,
  EnhancedStore,
  ThunkAction,
} from "@reduxjs/toolkit";
import createSagaMiddleware from "redux-saga";

import loggedInUserReducer from "../../features/auth/redux/authSlice";
import { bandApi } from "../../features/band/redux/bandApi";
import { showApi } from "../../features/tickets/redux/showApi";
import ticketReducer from "../../features/tickets/redux/ticketSlice";
import toastReducer from "../../features/toast/redux/toastSlice";
import { rootSaga } from "./sagas";

export const configureStoreWithMiddlewares = (
  initialState = {}
): EnhancedStore => {
  const sagaMiddleware = createSagaMiddleware();

  const store = configureStore({
    reducer: {
      user: loggedInUserReducer,
      tickets: ticketReducer,
      toast: toastReducer,
      [showApi.reducerPath]: showApi.reducer,
      [bandApi.reducerPath]: bandApi.reducer,
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware()
        .prepend(sagaMiddleware)
        .concat(showApi.middleware)
        .concat(bandApi.middleware),
    preloadedState: initialState,
    devTools: process.env.NODE_ENV !== "production",
  });

  sagaMiddleware.run(rootSaga);

  return store;
};

export const store = configureStoreWithMiddlewares();

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
