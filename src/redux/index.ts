import { Store, AnyAction } from "redux";

import { configureStore } from "@reduxjs/toolkit";

import createSagaMiddleware from "@redux-saga/core";

import rootReucer from "./reducers";
import rootSaga from "./sagas";

const sagaMiddleware = createSagaMiddleware();

const store: Store<unknown, AnyAction> = configureStore({
  reducer: rootReucer,
  middleware: [sagaMiddleware],
});

sagaMiddleware.run(rootSaga);

export default store;

export * from "./actions";
export * from "./@types";
