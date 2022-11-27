import { Store, AnyAction } from "redux";

import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";

import { configureStore } from "@reduxjs/toolkit";

import createSagaMiddleware from "@redux-saga/core";

import rootReucer from "src/redux/reducers";
import rootSaga from "src/redux/sagas";
import { AppDispatch, RootState } from "src/redux/@types/store";

const sagaMiddleware = createSagaMiddleware();

const store: Store<unknown, AnyAction> = configureStore({
  reducer: rootReucer,
  middleware: [sagaMiddleware],
});

sagaMiddleware.run(rootSaga);

export default store;

export * from "./actions";
export * from "./@types";

export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
export const useAppDispatch = () => useDispatch<AppDispatch>();
