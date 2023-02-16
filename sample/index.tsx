import React from "react";
import {
  NextCognitoAuthConfig,
  NextCognitoAuthProvider,
  useCognitoAuth,
} from "../dist";
const SampleApp = () => {
  return (
    <NextCognitoAuthProvider
      config={
        new NextCognitoAuthConfig({
          aws: {
            userPoolId: "asda",
            clientId: "asdas",
            requiredFields: { nickName: true },
          },
        })
      }
    ></NextCognitoAuthProvider>
  );
};

const Sample = () => {
  const { signUp, signIn, codeConfirmation, isAuthenticated } = useCognitoAuth<{
    nickname: true;
    address?: false;
  }>();
};
