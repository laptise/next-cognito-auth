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

export type State = {
  authStatus: AuthType;
  config: Config;
};

export type Context = {
  state: State;
  dispatch: (action: Action) => void;
};

const generateConfig = (config: Config): State => {
  return {
    authStatus: { status: "CHECKING" },
    config,
  };
};

export const NextCognitoAuth = createContext<Context>(null as any);

type Props = { config: Config };
export const NextCognitoAuthProvider: FC<PropsWithChildren<Props>> = ({
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
