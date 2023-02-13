import { CognitoUser } from "amazon-cognito-identity-js";
import React, { createContext, FC, PropsWithChildren, useReducer } from "react";
import { Config } from "./configs";
import { Action, reducer } from "./reducer";

type AuthType =
  | {
      status: "CHECKING";
    }
  | {
      status: "STRANGER";
    }
  | { status: "USER"; user: CognitoUser };

export type State<R extends { [key: string]: string }> = {
  authStatus: AuthType;
  config: Config<R>;
};

export type Context<R extends { [key: string]: string }> = {
  state: State<R>;
  dispatch: (action: Action) => void;
};

const generateConfig = <R extends { [key: string]: string }>(
  config: Config<R>
): State<R> => {
  return {
    authStatus: { status: "CHECKING" },
    config,
  };
};

export const NextCognitoAuth = createContext<Context<{}>>(null as any);

type Props<R extends { [key: string]: string }> = { config: Config<R> };
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
