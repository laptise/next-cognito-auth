import React, { createContext, useReducer } from "react";
import { reducer } from "./reducer";
var generateConfig = function (config) {
    return {
        authStatus: { status: "CHECKING" },
        config: config,
    };
};
export var NextCognitoAuth = createContext(null);
export var NextCognitoAuthProvider = function (_a) {
    var children = _a.children, config = _a.config;
    var _b = useReducer(reducer, generateConfig(config)), state = _b[0], dispatch = _b[1];
    return (<NextCognitoAuth.Provider value={{ state: state, dispatch: dispatch }}>
      {children}
    </NextCognitoAuth.Provider>);
};
