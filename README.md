# Deployment

## To install dependencies

`npm i`

## To run locally

`npm start`

## To generate production assets

`npm run build`

export SET NODE_OPTIONS=--openssl-legacy-provider

# Integrating with Amazon Cognito

We will need to use AWS [Amplify](https://aws.amazon.com/amplify/), as a library that helps us interact with AWS services and integrate them
easily with our application

To use Amplify, we first need to download and configure it:

- `npm install -g @aws-amplify/cli`
- `npm config set registry https://registry.npmjs.org/`

- `amplify configure`

- and to use it in the front end
  `@aws-amplify/ui-react@1.2.5`

Then you can initialize Amplify to your existing front end application using

- `amplify init`

To integrate with Cognito you can:

- `amplify add auth`

- `amplify push`

At this point you should check your AWS console and confirm the user pool has been created

To add a front end page for user authentication that makes use of your Cognito user pool
you will need to do the following:

- update your **_index.js_** to include the following:

```javascript
import Amplify from "aws-amplify";
import awsconfig from "./aws-exports";

Amplify.configure(awsconfig);
```

- update **App.js**

```javascript
import { withAuthenticator, AmplifySignOut } from "@aws-amplify/ui-react";
...
export default withAuthenticator(App);
```
