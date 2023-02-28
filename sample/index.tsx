import React from "react";
import {
  NextCognitoAuthConfig,
  NextCognitoAuthProvider,
  useCognitoAuth,
  withServerSideAuth,
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
          cookie: { domain: "localhost" },
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

export const getServerSideProps = withServerSideAuth(async ({ auth }) => {
  return { props: {} };
});
