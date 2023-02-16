import {
  AuthenticationDetails,
  CognitoRefreshToken,
  CognitoUser,
  CognitoUserAttribute,
  CognitoUserPool,
  CognitoUserSession,
  ISignUpResult,
} from "amazon-cognito-identity-js";
import { useContext, useEffect } from "react";
import { NextCognitoAuth } from "./context";
import {
  BaseRequiredFields,
  KeyOf,
  SignInResult,
  UseCognitoAuth,
} from "./type";

const useNextCognitoAuthProvider = () => {
  const { state } = useContext(NextCognitoAuth);
  const { config } = state;
  const { aws } = config;
  const userPool = new CognitoUserPool({
    UserPoolId: aws.userPoolId,
    ClientId: aws.clientId,
  });
  return { userPool, requiredFields: aws.requiredFields || {} };
};

export const useCognitoAuth = <
  R extends BaseRequiredFields
>(): UseCognitoAuth<R> => {
  const { userPool, requiredFields } = useNextCognitoAuthProvider();
  const { state, dispatch } = useContext(NextCognitoAuth);
  const { isAuthenticated, currentUser } = state;

  useEffect(() => {
    checkSession();
  }, []);

  const checkSession = async () => {
    try {
      const user = userPool.getCurrentUser();
      if (!user) throw "User not signed";
      const session = await getSession(user);
      const isValid = session.isValid();
      if (!isValid) {
        await referesh(user, session.getRefreshToken());
      }
      if (user) {
        dispatch({ type: "SET_USER", user });
      }
    } catch {
      dispatch({ type: "UNSET_USER" });
    }
  };

  const referesh = async (
    user: CognitoUser,
    refreshToken: CognitoRefreshToken
  ) => {
    return await new Promise((resolve, reject) => {
      user.refreshSession(refreshToken, (e, r) => {
        if (e) {
          console.error(e);
          reject(e);
        }
        if (r) {
          console.log(r);
          resolve(r);
        }
      });
    });
  };

  const getSession = async (user: CognitoUser) => {
    return await new Promise<CognitoUserSession>((resolve, reject) => {
      user?.getSession((e: Error | null, r: CognitoUserSession | null) => {
        if (e) {
          reject(e);
        }
        if (r) {
          resolve(r);
        }
      });
    });
  };

  const customFieldsToAttributes = (customFields: {
    [key in KeyOf<R>]: string;
  }) => {
    const attributes: CognitoUserAttribute[] = [];
    for (const [key, value] of Object.entries(customFields)) {
      attributes.push(new CognitoUserAttribute({ Name: key, Value: value }));
    }
    return attributes;
  };

  const signUp = async (
    username: string,
    password: string,
    customFields: { [key in KeyOf<R>]: string }
  ) => {
    const requiredKeys = Object.entries(requiredFields || {})
      .filter(([key, val]) => val)
      .map((x) => x[0]);
    const unfilledField = requiredKeys.find(
      (keyName) =>
        customFields[keyName] === null || customFields[keyName] === undefined
    );
    if (unfilledField === undefined) {
      throw `Required fields not fulfilled: ${unfilledField}`;
    }
    return await new Promise<ISignUpResult>((resolver, rejector) => {
      userPool?.signUp(
        username,
        password,
        customFieldsToAttributes(customFields),
        [],
        (e, r) => {
          if (r) {
            resolver(r);
          }
          if (e) {
            rejector(e);
          }
        }
      );
    });
  };

  const signIn = async (username: string, password: string) => {
    return await new Promise<SignInResult>((resolover, rejector) => {
      const auth = new AuthenticationDetails({
        Username: username,
        Password: password,
      });
      const user = new CognitoUser({ Username: username, Pool: userPool });
      user.authenticateUser(auth, {
        onSuccess(session, userConfirmationNecessary) {
          resolover({ session, userConfirmationNecessary });
        },
        onFailure(err) {
          rejector(err);
        },
      });
    });
  };

  const signOut = async () => {
    return await new Promise<void>((resolve, reject) => {
      if (isAuthenticated) {
        currentUser.signOut(() => {
          dispatch({ type: "UNSET_USER" });
          resolve();
        });
      } else {
        resolve();
      }
    });
  };

  const codeConfirmation = async (username: string, code: string) => {
    return await new Promise<"SUCCESS">((resolve, reject) => {
      if (userPool) {
        const user = new CognitoUser({ Pool: userPool, Username: username });
        user.confirmRegistration(code, true, (e, r) => {
          if (e) {
            reject(e);
          }
          if (r) {
            resolve("SUCCESS");
          }
        });
      } else {
        reject();
      }
    });
  };

  const forgotPassword = async (username: string) => {
    return await new Promise<any>((resolve, reject) => {
      if (userPool) {
        const user = new CognitoUser({ Pool: userPool, Username: username });
        user.forgotPassword({
          onSuccess(data) {
            resolve(data);
          },
          onFailure(err) {
            reject(err);
          },
        });
      } else {
        reject();
      }
    });
  };

  const changePassword = async (
    username: string,
    oldPassword: string,
    newPassword: string
  ) => {
    return await new Promise<"SUCCESS">((resolve, reject) => {
      if (userPool) {
        const user = new CognitoUser({ Pool: userPool, Username: username });
        user.changePassword(oldPassword, newPassword, (e, r) => {
          if (e) {
            reject();
          }
          if (r) {
            resolve("SUCCESS");
          }
        });
      } else {
        reject();
      }
    });
  };

  return {
    signUp,
    signIn,
    signOut,
    isAuthenticated,
    codeConfirmation,
    forgotPassword,
    changePassword,
  };
};
