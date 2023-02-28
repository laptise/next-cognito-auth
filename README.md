# Next Cognito Auth

Provides Cognito Authentication with hooks.
All functions are promise based.

## Provided features

Now only simple features are provided

- SignUp
- CodeConfirmation
- SignIn
- SignOut
- Authenticate state
- ForgotPassword
- PasswordChange

## Usage

usage

### SetUp

In `_app.tsx`

```tsx
import { NextCognitoAuthProvider, initServerSideAuth } from "next-cognito-auth";
const App = () => {
  const NCAConfig = {
    aws: { userPoolId: "USER_POOL_ID", clientId: "CLIENT_ID" },
    cookie: { domain: "your_domain" },
  };
  initServerSideAuth(NCAConfig);
  return (
    <NextCognitoAuthProvider config={NCAConfig}>
      <Component {...pageProps} />
    </NextCognitoAuthProvider>
  );
};
```

### SignUp

```tsx
import { useCognitoAuth } from "next-cognito-auth";

const SignUpSample = () => {
  const { SignUp } = useCognitoAuth();
  const handler = async () => {
    await SignIn("example@sample.site", "SamplePassword!");
    console.log("DONE!");
  };
  //..
};
```

### CodeConfirmation

```tsx
import { useCognitoAuth } from "next-cognito-auth";

const CodeConfirmationSample = () => {
  const { codeConfirmation } = useCognitoAuth();
  const handler = async () => {
    await codeConfirmation("example@sample.site", "182836");
    console.log("DONE!");
  };
  //..
};
```

### SignIn

```tsx
import { useCognitoAuth } from "next-cognito-auth";

const SignIn = () => {
  const { codeConfirmation } = useCognitoAuth();
  const handler = async () => {
    const res = await codeConfirmation("example@sample.site", "182836");
    console.log("DONE!");
    const jwt = res.session.getIdToken().getJwtToken();
    console.log("tokens here!");
  };
  //..
};
```

### AuthState

for now, CSR only

```tsx
const WhoAmI = () => {
  const { isAuthenticated } = useCognitoAuth();
  return isAuthenticated ? (
    <span>Hello user!</span>
  ) : (
    <span>Hello stranger!</span>
  );
};
```

## Work with SSR

### Get auth user

Simillar with getServerSideProps of Next.js

```tsx
import { withServerSideAuth } from "next-cognito-auth";
export const getServerSideProps = withServerSideAuth<{ auth: any }>(
  // Your auth user will be passed here. (nullable)
  ({ req, auth }) => {
    // So you can control auth behaviours ..
    if (!auth) {
      return { notFound: true };
    }
    return { props: { auth } };
  }
);
```

### Get auth user manually in SSR scope

```tsx
import { GetServerSideProps } from "next";
import { getServerSideAuth } from "next-cognito-auth";
export const getServerSideProps: GetServerSideProps = (ctx) => {
  const auth = getServerSideAuth(ctx);
  // do something..
};
```
