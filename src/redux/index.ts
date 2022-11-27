import {
  configureStore,
  applyMiddleware,
  Store,
  AnyAction,
} from "@reduxjs/toolkit";
import createSagaMiddleware from "@redux-saga/core";

const sagaMiddleware = createSagaMiddleware()

const store: Store<unknown, AnyAction> = configureStore({
    reducer: rootReucer,
    middleware: applyMiddleware(sagaMiddleware)
})

sagaMiddleware.run(rootSaga)

export default store

export * from './actions'
export * from './@types'