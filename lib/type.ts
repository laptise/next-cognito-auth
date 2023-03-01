import {
  ISignUpResult,
  CognitoUserSession,
  CognitoUser,
  CognitoUserPool,
} from "amazon-cognito-identity-js";

export type UseCognitoAuth<R extends BaseRequiredFields> = {
  signUp: CognitoAuthSignUp<R>;
  signIn: CognitoAuthSignIn;
  signOut: () => Promise<void>;
  codeConfirmation: CongitoAuthCodeConfirmation;
  forgotPassword: CognitoAuthForgotPssword;
  changePassword: CognitoAuthChangePassword;
  isAuthenticated: boolean;
  user: CognitoUser | null;
  userPool: CognitoUserPool;
};

export type KeyOf<R> = keyof R;

/**@param username aa*/
export type CognitoAuthSignUp<R extends BaseRequiredFields> = (
  /**Username. It can be email address if you allowed. */
  username: string,
  password: string,
  /**custom fields if you need. */
  customFields: { [key in KeyOf<R>]: string }
) => Promise<ISignUpResult>;

export type CognitoAuthSignIn = (
  /**Username. It can be email address if you allowed. */
  username: string,
  password: string
) => Promise<SignInResult>;

export type CongitoAuthCodeConfirmation = (
  username: string,
  code: string
) => Promise<"SUCCESS">;

export type SignInResult = {
  session: CognitoUserSession;
  userConfirmationNecessary?: boolean;
};

export type CognitoAuthChangePassword = (
  usename: string,
  oldPassword: string,
  newPassword: string
) => Promise<"SUCCESS">;

export type CognitoAuthForgotPssword = (username: string) => Promise<any>;

export type BaseRequiredFields = {
  [key: string]: boolean;
};
