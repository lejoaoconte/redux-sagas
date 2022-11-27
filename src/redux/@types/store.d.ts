import rootReducer from "src/redux/reducers";

import store from "src/redux";

export type RootState = ReturnType<typeof rootReducer>;
export type AppDispatch = typeof store.dispatch;
