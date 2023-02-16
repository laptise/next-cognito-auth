import React from "react";
import {
  NextCognitoAuthConfig,
  NextCognitoAuthProvider,
  useCognitoAuth,
} from "../dist";
const dada = () => {
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
const Hel = () => {
  const { signUp } = useCognitoAuth<{ hello: true; jees?: true }>();
  signUp("la", "asda", { hello: "asd" });
};
