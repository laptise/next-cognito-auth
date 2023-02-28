import {
  CognitoAccessToken,
  CognitoIdToken,
  CognitoRefreshToken,
  CognitoUserSession,
} from "amazon-cognito-identity-js";
import {
  GetServerSideProps,
  GetServerSidePropsContext,
  GetServerSidePropsResult,
  PreviewData,
} from "next";
import { NextApiRequestCookies } from "next/dist/server/api-utils";
import { parseCookies } from "nookies";
import { ParsedUrlQuery } from "querystring";
import { Config } from "./configs";
import { BaseRequiredFields } from "./type";

type AuthInjected<T> = T & {
  /**Logged in user */
  auth?: any;
};

type MayBePromise<T> = T | Promise<T>;

const getConfig = () => {
  const config = process.env.NextCognitoAuthClientId;
  if (!config)
    throw "Cognito config is not found! You must call initServerSideAuth.";
  else return config;
};

export const withServerSideAuth = <
  Props extends { [key: string]: any } = { [key: string]: any },
  Params extends ParsedUrlQuery = ParsedUrlQuery,
  Preview extends PreviewData = PreviewData
>(
  serverSidePropsFn: (
    context: AuthInjected<GetServerSidePropsContext<Params, Preview>>
  ) => MayBePromise<GetServerSidePropsResult<Props>>
): GetServerSideProps<Props, Params, Preview> => {
  const serverSidePropsWithAuth = serverSidePropsFn as GetServerSideProps<
    Props,
    Params,
    Preview
  >;

  return (context: GetServerSidePropsContext<Params, Preview>) => {
    const auth = getServerSideAuth(context);
    return serverSidePropsWithAuth.call(this, Object.assign(context, { auth }));
  };
};

export const getServerSideAuth = (context: {
  req: { cookies: NextApiRequestCookies };
}) => {
  const cookie = parseCookies(context);
  const clientId = getConfig();
  const lastUser =
    cookie[`CognitoIdentityServiceProvider.${clientId}.LastAuthUser`];
  const idToken =
    cookie[`CognitoIdentityServiceProvider.${clientId}.${lastUser}.idToken`];
  const accessToken =
    cookie[
      `CognitoIdentityServiceProvider.${clientId}.${lastUser}.accessToken`
    ];
  const refreshToken =
    cookie[
      `CognitoIdentityServiceProvider.${clientId}.${lastUser}.refreshToken`
    ];
  const session = new CognitoUserSession({
    RefreshToken: new CognitoRefreshToken({ RefreshToken: refreshToken }),
    IdToken: new CognitoIdToken({ IdToken: idToken }),
    AccessToken: new CognitoAccessToken({ AccessToken: accessToken }),
  });
  const isValid = session.isValid();
  if (isValid) {
    const {
      iss,
      origin_jti,
      aud,
      event_id,
      token_use,
      auth_time,
      exp,
      iat,
      jti,
      ...info
    } = session.getIdToken().payload;
    return info;
  }
};

export const initServerSideAuth = ({ aws }: Config<BaseRequiredFields>) => {
  const { clientId } = aws;
  process.env.NextCognitoAuthClientId = clientId;
};
