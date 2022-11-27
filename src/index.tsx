import React from "react";

import ReactDOM from "react-dom/client";

import { Provider } from "react-redux";

import LoadingBar from "react-redux-loading-bar";

import store from "src/redux";

import "./index.css";

import { App } from "./App";
import { BrowserRouter } from "react-router-dom";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(
  <Provider store={store}>
    <BrowserRouter>
      <LoadingBar />
      <App />
    </BrowserRouter>
  </Provider>
);
