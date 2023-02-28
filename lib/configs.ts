import { ICookieStorageData } from "amazon-cognito-identity-js";
import { BaseRequiredFields } from "./type";

type AWSConfig<R extends BaseRequiredFields> = {
  userPoolId: string;
  issuer?: string;
  clientId: string;
  /**provide user props. Key to prop name, Value to is required.
   *
   * Example if `nickname` is required, `address` is optional:
   * ```
   * { nickname: true, address?: false }
   * ```
   */
  requiredFields?: R;
};
export type Config<R extends BaseRequiredFields> = {
  aws: AWSConfig<R>;
  cookie: ICookieStorageData;
};

export class NextCognitoAuthConfig<R extends BaseRequiredFields> {
  aws: AWSConfig<R>;
  cookie: ICookieStorageData;
  constructor({ aws, cookie }: Config<R>) {
    this.aws = aws;
    this.cookie = cookie;
  }
}
