import { all, call, put, takeLatest } from "@redux-saga/core/effects";

import { hideLoading, showLoading } from "react-redux-loading-bar";

import api from "src/services/api";

import { UserType } from "src/redux/@types/user";
import { getUserFailure, getUserSuccess } from "src/redux/actions";
import { GET_USER_REQUEST } from "src/redux/@types";

let userApi: UserType;

async function userRequest(login: string) {
  const config = {
    headers: { Authorization: "Bearer teste-token" },
  };
  try {
    const request: any = await api.get(`/user?login=${login}`, config);
    if (request.data.length > 0) userApi = request.data[0];
    else userApi = {} as any;
    return true;
  } catch {
    return false;
  }
}

export function* userData(action: { type: string; payload: string }) {
  yield put(showLoading());
  try {
    yield call(userRequest, action.payload);
    yield put(getUserSuccess(userApi));
  } catch (e) {
    yield put(getUserFailure(`Erro na requisição ${e}`));
  } finally {
    yield put(hideLoading());
  }
}

export default all([takeLatest(GET_USER_REQUEST, userData)]);
