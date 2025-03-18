# Google Auth Setup for LOOKYM

## 1. Create a Google Cloud Project

- Go to [https://console.cloud.google.com/](https://console.cloud.google.com/) and create a new project.
- Enable the Google Sign-In API.

## 2. Configure OAuth Consent Screen

- Go to the OAuth consent screen settings in your Google Cloud project.
- Choose an external user type.
- Fill in the required information, such as the app name, user support email, and developer contact information.
- Add the required scopes: `email` and `profile`.

## 3. Create OAuth 2.0 Credentials

- Go to the Credentials settings in your Google Cloud project.
- Create a new OAuth 2.0 client ID.
- Choose the application type (e.g., Web application, iOS, Android).
- Add the authorized JavaScript origins and redirect URIs.

## 4. Environment Variables

- Add the following environment variables to your `.env` file:

```
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
```

## 5. Implement Google Sign-In

- In `utils/google-auth.ts`, implement the Google Sign-In flow using the `expo-auth-session` and `expo-web-browser` libraries.

```typescript
import * as AuthSession from 'expo-auth-session';
import * as WebBrowser from 'expo-web-browser';
import {
  GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET,
  REDIRECT_URI,
} from '../constants/google';

WebBrowser.maybeCompleteAuthSession();

const useProxy = true;

const redirectUri = AuthSession.makeRedirectUri({
  useProxy,
});

export function useGoogleAuth() {
  const [request, response, promptAsync] = AuthSession.useAuthRequest(
    {
      clientId: GOOGLE_CLIENT_ID,
      clientSecret: GOOGLE_CLIENT_SECRET,
      redirectUri,
      scopes: ['profile', 'email'],
    },
    {
      useProxy,
      authorizationEndpoint: 'https://accounts.google.com/o/oauth2/v2/auth',
      tokenEndpoint: 'https://oauth2.googleapis.com/token',
    }
  );

  return { request, response, promptAsync };
}