import { CognitoUser } from "amazon-cognito-identity-js";
import { createContext, FC, PropsWithChildren, useReducer } from "react";
import { Config } from "./configs";
import { Action, reducer } from "./reducer";
import { BaseRequiredFields } from "./type";

export type AuthType =
  | {
      status: "CHECKING";
    }
  | {
      status: "STRANGER";
    }
  | { status: "USER"; user: CognitoUser };

type StateBody<R extends BaseRequiredFields> = {
  config: Config<R>;
};
export type State<R extends BaseRequiredFields> = StateBody<R> &
  (
    | {
        isAuthenticated: true;
        currentUser: CognitoUser;
      }
    | { isAuthenticated: false; currentUser: null }
  );

export type Context<R extends BaseRequiredFields> = {
  state: State<R>;
  dispatch: (action: Action) => void;
};

const generateConfig = <R extends BaseRequiredFields>(
  config: Config<R>
): State<R> => {
  return {
    isAuthenticated: false,
    currentUser: null,
    config,
  };
};

export const NextCognitoAuth = createContext<Context<{}>>(null as any);

type Props<R extends BaseRequiredFields> = {
  /**Provide options here. */
  config: Config<R>;
};
export const NextCognitoAuthProvider: FC<PropsWithChildren<Props<{}>>> = ({
  children,
  config,
}) => {
  const [state, dispatch] = useReducer(reducer, generateConfig(config));
  return (
    <NextCognitoAuth.Provider value={{ state, dispatch }}>
      {children}
    </NextCognitoAuth.Provider>
  );
};
