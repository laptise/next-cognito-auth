import {
  CognitoUser,
  CognitoUserAttribute,
  CognitoUserPool,
  AuthenticationDetails,
} from "amazon-cognito-identity-js";
import { useContext } from "react";
import { NextCognitoAuth } from "./context";

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
  const { state } = useContext(NextCognitoAuth);
  const { authStatus } = state;

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

  return { signUp, authStatus, signIn };
};
