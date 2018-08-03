import {
  checkIfCustomerExists,
  generateResetPasswordToken,
  populateCommercetoolsException,
} from '../../services/commercetools';

describe('searching customers by email address', () => {
  describe('when the email addres is not found', () => {
    let client;
    let res;
    let populateExceptionFn;
    beforeEach(async () => {
      client = {
        execute: jest.fn(email =>
          Promise.resolve({ body: { statusCode: 200, results: [] } })
        ),
      };
      populateExceptionFn = jest.fn();
      res = await checkIfCustomerExists(
        'test@devgurus.io',
        client,
        populateExceptionFn
      );
    });
    test('email address not found', () => {
      expect(res).toBeFalsy();
    });
    test('no exception occured', () => {
      expect(populateExceptionFn).not.toHaveBeenCalled();
    });
  });
  describe('when the email addres is found', () => {
    let client;
    let res;
    let populateExceptionFn;
    beforeEach(async () => {
      client = {
        execute: jest.fn(email =>
          Promise.resolve({
            body: { statusCode: 200, results: [{ email }] },
          })
        ),
      };
      populateExceptionFn = jest.fn();
      res = await checkIfCustomerExists(
        'test@devgurus.io',
        client,
        populateExceptionFn
      );
    });
    test('email address found', () => {
      expect(res).toBeTruthy();
    });
    test('no exception occured', () => {
      expect(populateExceptionFn).not.toHaveBeenCalled();
    });
  });
  describe('when exception is thrown', () => {
    let client;
    let res;
    let populateExceptionFn;
    beforeEach(async () => {
      client = {
        execute: jest.fn(() => {
          throw Error('Error');
        }),
      };
      populateExceptionFn = jest.fn();
      res = await checkIfCustomerExists(
        'test@devgurus.io',
        client,
        populateExceptionFn
      );
    });
    test('exception is caught', () => {
      expect(populateExceptionFn).toHaveBeenCalledTimes(1);
    });
  });
});

describe('generating reset password token', () => {
  let client;
  let res;
  let populateExceptionFn;
  beforeEach(async () => {
    client = {
      execute: jest.fn(() =>
        Promise.resolve({
          body: { value: 'ABCDEFG123456789' },
        })
      ),
    };
    populateExceptionFn = jest.fn();
    res = await generateResetPasswordToken(
      'test@devgurus.io',
      client,
      populateExceptionFn
    );
  });
  test('token generated', () => {
    expect(res).toBe('ABCDEFG123456789');
  });
  test('no exception occured', () => {
    expect(populateExceptionFn).not.toHaveBeenCalled();
  });
  describe('when exception is thrown', () => {
    let client;
    let res;
    let populateExceptionFn;
    beforeEach(async () => {
      client = {
        execute: jest.fn(() => {
          throw Error('Error');
        }),
      };
      populateExceptionFn = jest.fn();
      res = await generateResetPasswordToken(
        'test@devgurus.io',
        client,
        populateExceptionFn
      );
    });
    test('exception is caught', () => {
      expect(populateExceptionFn).toHaveBeenCalledTimes(1);
    });
  });
});

describe('populate exception', () => {
  beforeEach(async () => {
    global.console = { error: jest.fn() };
    try {
      populateCommercetoolsException({
        body: { message: 'Error', statusCode: 500 },
      });
    } catch (_) {}
  });
  test('throws exception', () => {
    expect(populateCommercetoolsException).toThrow();
  });
  test('logs an error', () => {
    expect(console.error).toHaveBeenCalledTimes(1);
    expect(console.error).toHaveBeenCalledWith(
      'Commercetools -> Error when executing the query in commercetools: { code: 500, message: Error }'
    );
  });
});
