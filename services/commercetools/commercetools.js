import { createRequestBuilder } from '@commercetools/api-request-builder';

const requestBuilder = createRequestBuilder({
  projectKey: process.env.COMMERCETOOLS_PROJECT_KEY || 'void',
});

const customersService = requestBuilder.customers;

export const checkIfCustomerExists = async (email, client) => {
  const uri = customersService.where(`email="${email}"`).build();
  const fetchRequest = {
    uri,
    method: 'GET',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
  };
  try {
    const queryResult = await client.execute(fetchRequest);
    return queryResult.body.results.length > 0;
  } catch (ex) {
    populateCommercetoolsException(ex);
  }
};

export const generateResetPasswordToken = async (email, client) => {
  const resetRequest = {
    uri: `/${process.env.COMMERCETOOLS_PROJECT_KEY}/customers/password-token`,
    method: 'POST',
    body: { email },
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
  };
  try {
    const tokenRequest = await client.execute(resetRequest);
    return tokenRequest.body.value;
  } catch (ex) {
    populateCommercetoolsException(ex);
  }
};

const populateCommercetoolsException = exception => {
  console.error(
    `Commercetools -> Error when executing the query in commercetools: { code: ${
      exception.body.statusCode
    }, message: ${exception.body.message} }`
  );
  throw exception;
};
