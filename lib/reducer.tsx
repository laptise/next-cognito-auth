import { State } from "./context";

export type Action =
  | {
      type: "SET_USER";
    }
  | {
      type: "UNSET_USER";
    };

export const reducer = (state: State<{}>, action: Action): State<{}> => {
  switch (action.type) {
    case "SET_USER":
      return { ...state };
    default:
      return state;
  }
};
