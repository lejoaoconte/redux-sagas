import { UserType } from "src/redux/@types/user";

import {
  GET_USER_FAILURE,
  GET_USER_REQUEST,
  GET_USER_SUCCESS,
} from "src/redux/@types/index";

export function getUserRequest(login: string): {
  type: string;
  payload: string;
} {
  return {
    type: GET_USER_REQUEST,
    payload: login,
  };
}

export function getUserSuccess(user: UserType): {
  type: string;
  payload: UserType;
} {
  return {
    type: GET_USER_SUCCESS,
    payload: user,
  };
}

export function getUserFailure(error: string): {
  type: string;
  payload: string;
} {
  return {
    type: GET_USER_FAILURE,
    payload: error,
  };
}
