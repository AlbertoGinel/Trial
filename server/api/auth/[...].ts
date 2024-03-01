//el buen TS
import { NuxtAuthHandler } from '#auth';
import CredentialsProvider from 'next-auth/providers/credentials';

export default NuxtAuthHandler({
  pages: {
    signIn: '/login',
  },
  providers: [
    CredentialsProvider.default({
      name: 'API',
      async authorize(credentials: { email: string, password: string }) {
        console.log("entramos ", credentials);

        try {
          // Make a POST request to the login API endpoint with provided credentials
          const response = await fetch('https://api.fxer.net/api/login', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(credentials)
          });

          // Check if the login was successful based on the response status
          if (response.ok) {
            // Extract the CSRF token from the response cookie
            const csrfCookie = response.headers.get('Set-Cookie');
            const csrfToken = csrfCookie?.match(/fxer_csrf=([^;]+)/)?.[1];

            // Ensure that the CSRF token is available
            if (!csrfToken) {
              console.error('CSRF token not found in the response cookie');
              return null;
            }

            // Return the user data along with the CSRF token
            return { user: {}, csrfToken };
          } else {
            // If login failed or response status is not ok, return null
            console.error('Login failed:', response.statusText);
            return null;
          }
        } catch (error) {
          console.error('Error occurred during login:', error);
          return null;
        }
      }
    })
  ]
});