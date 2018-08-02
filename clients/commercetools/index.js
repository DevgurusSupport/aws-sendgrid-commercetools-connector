require('isomorphic-fetch');
import { createClient } from '@commercetools/sdk-client';
import { createHttpMiddleware } from '@commercetools/sdk-middleware-http';
import { createAuthMiddlewareForClientCredentialsFlow } from '@commercetools/sdk-middleware-auth';

const client = () =>
  createClient({
    middlewares: [
      createAuthMiddlewareForClientCredentialsFlow({
        host:
          process.env.COMMERCETOOLS_AUTH_HOST ||
          'https://auth.commercetools.co',
        projectKey: process.env.COMMERCETOOLS_PROJECT_KEY,
        credentials: {
          clientId: process.env.COMMERCETOOLS_CLIENT_ID,
          clientSecret: process.env.COMMERCETOOLS_CLIENT_SECRET,
        },
      }),
      createHttpMiddleware({
        host:
          process.env.COMMERCETOOLS_API_HOST || 'https://api.commercetools.co',
      }),
    ],
  });

export { client };
