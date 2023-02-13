import {
  CognitoUser,
  CognitoUserAttribute,
  CognitoUserPool,
  AuthenticationDetails,
  CognitoUserSession,
  CognitoRefreshToken,
} from "amazon-cognito-identity-js";
import { useContext, useEffect } from "react";
import { AuthType, NextCognitoAuth } from "./context";

const useNextCognitoAuthProvider = () => {
  const { state } = useContext(NextCognitoAuth);
  const { config } = state;
  const { aws } = config;
  const { requiredFields } = aws;
  const userPool = new CognitoUserPool({
    UserPoolId: aws.userPoolId,
    ClientId: aws.clientId,
  });
  return { userPool, requiredFields };
};

export const useCognitoAuth = () => {
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
    [key: string]: string;
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
    customFields: typeof requiredFields
  ) => {
    return await new Promise((resolver, rejector) => {
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
    return await new Promise((resolover, rejector) => {
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

  return { signUp, signIn, signOut, isAuthenticated };
};
