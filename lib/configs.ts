type AWSConfig<R extends { [key: string]: string }> = {
  userPoolId: string;
  issuer?: string;
  clientId: string;
  requiredFields: R;
};
export type Config<R extends { [key: string]: string }> = {
  aws: AWSConfig<R>;
};

export class NextCognitoAuthConfig<R extends { [key: string]: string }> {
  aws: AWSConfig<R>;
  constructor({ aws }: Config<R>) {
    this.aws = aws;
  }
}
