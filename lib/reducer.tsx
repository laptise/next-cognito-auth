import { CognitoUser } from "amazon-cognito-identity-js";
import { State } from "./context";

export type Action =
  | {
      type: "SET_USER";
      user: CognitoUser;
    }
  | {
      type: "UNSET_USER";
    };

export const reducer = (state: State<{}>, action: Action): State<{}> => {
  switch (action.type) {
    case "SET_USER":
      state = { ...state, isAuthenticated: true, currentUser: action.user };
      return state;
    case "UNSET_USER":
      state = { ...state, isAuthenticated: false, currentUser: null };
      return { ...state };
    default:
      return state;
  }
};
