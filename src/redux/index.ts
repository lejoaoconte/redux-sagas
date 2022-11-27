import { applyMiddleware, Store, AnyAction } from "redux";

import { configureStore } from "@reduxjs/toolkit";

import createSagaMiddleware from "@redux-saga/core";

import rootReucer from "./reducers";

const sagaMiddleware = createSagaMiddleware();

const store: Store<unknown, AnyAction> = configureStore({
  reducer: rootReucer,
  middleware: applyMiddleware(sagaMiddleware),
});

sagaMiddleware.run(rootSaga);

export default store;

export * from "./actions";
export * from "./@types";
