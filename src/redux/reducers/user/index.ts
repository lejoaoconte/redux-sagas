import {
  GET_USER_FAILURE,
  GET_USER_REQUEST,
  GET_USER_SUCCESS,
} from "src/redux/@types/index";
import { UserState, UserType } from "src/redux/@types/user";

const initialState: UserState = {
  user: {
    avatarURL: "",
    email: "",
    id: "",
    login: "",
    name: "",
    password: "",
    telefone: "",
  },
  loading: false,
  error: "",
};

export function userReducer(
  state = initialState,
  action: { type: string; payload: UserType }
) {
  switch (action.type) {
    case GET_USER_REQUEST:
      return {
        ...state,
        loading: true,
        error: "",
        user: action.payload,
      };
    case GET_USER_SUCCESS:
      return {
        ...state,
        loading: false,
        error: "",
        user: action.payload,
      };
    case GET_USER_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    default:
      return state;
  }
}
