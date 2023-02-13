import { CognitoUser } from "amazon-cognito-identity-js";
import { State } from "./context";

export type Action =
  | {
      type: "SET_USER";
      user: CognitoUser;
    }
  | {
      type: "UNSET_USER";
    }
  | { type: "CHECKED" }
  | { type: "CHECKING" };

export const reducer = (state: State<{}>, action: Action): State<{}> => {
  switch (action.type) {
    case "SET_USER":
      if (state.authStatus.status !== "CHECKING") {
        state.prevStatus = state.authStatus.status;
      }
      state.authStatus = { status: "USER", user: action.user };
      return { ...state };
    case "UNSET_USER":
      if (state.authStatus.status !== "CHECKING") {
        state.prevStatus = state.authStatus.status;
      }
      state.authStatus = { status: "STRANGER" };
      return { ...state };
    case "CHECKED":
      return state;
    default:
      return state;
  }
};
