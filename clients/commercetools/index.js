require('isomorphic-fetch');
import { createClient } from '@commercetools/sdk-client';
import { createHttpMiddleware } from '@commercetools/sdk-middleware-http';
import { createAuthMiddlewareForClientCredentialsFlow } from '@commercetools/sdk-middleware-auth';

const client = createClient({
  middlewares: [
    createAuthMiddlewareForClientCredentialsFlow({
      host: 'https://auth.commercetools.co',
      projectKey: process.env.COMMERCETOOLS_PROJECT_KEY,
      credentials: {
        clientId: process.env.COMMERCETOOLS_CLIENT_ID,
        clientSecret: process.env.COMMERCETOOLS_CLIENT_SECRET,
      },
    }),
    createHttpMiddleware({
      host: 'https://api.commercetools.co',
    }),
  ],
});

export { client };
