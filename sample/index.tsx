import React from "react";
import { NextCognitoAuthConfig, NextCognitoAuthProvider } from "../dist";
const dada = () => {
  return (
    <NextCognitoAuthProvider
      config={
        new NextCognitoAuthConfig({
          aws: {
            userPoolId: "asda",
            clientId: "asdas",
            requiredFields: { nickName: "nickName" },
          },
        })
      }
    ></NextCognitoAuthProvider>
  );
};
