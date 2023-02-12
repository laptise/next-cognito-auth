import { useContext } from "react";
import { NextCognitoAuth } from "./context";
export var useNextCognitoAuth = function () {
    var state = useContext(NextCognitoAuth).state;
};
