import { useContext } from "react";
import { NextCognitoAuth } from "./context";

export const useNextCognitoAuth = () => {
  const { state } = useContext(NextCognitoAuth);
};
