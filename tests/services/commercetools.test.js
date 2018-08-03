import {
  checkIfCustomerExists,
  generateResetPasswordToken,
} from '../../services/commercetools';

describe('searching customers by email address', () => {
  describe('when the email addres is not found', () => {
    let client;
    let res;
    beforeEach(async () => {
      client = {
        execute: jest.fn(email =>
          Promise.resolve({ body: { statusCode: 200, results: [] } })
        ),
      };
      res = await checkIfCustomerExists('test@devgurus.io', client);
    });
    test('email address not found', () => {
      expect(res).toBeFalsy();
    });
  });
  describe('when the email addres is found', () => {
    let client;
    let res;
    beforeEach(async () => {
      client = {
        execute: jest.fn(email =>
          Promise.resolve({
            body: { statusCode: 200, results: [{ email }] },
          })
        ),
      };
      res = await checkIfCustomerExists('test@devgurus.io', client);
    });
    test('email address found', () => {
      expect(res).toBeTruthy();
    });
  });
});

describe('generating reset password token', () => {
  let client;
  let res;
  beforeEach(async () => {
    client = {
      execute: jest.fn(() =>
        Promise.resolve({
          body: { value: 'ABCDEFG123456789' },
        })
      ),
    };
    res = await generateResetPasswordToken('test@devgurus.io', client);
  });
  test('token generated', () => {
    expect(res).toBe('ABCDEFG123456789');
  });
});
