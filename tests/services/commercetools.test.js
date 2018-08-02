import {
  checkIfCustomerExists,
  generateResetPasswordToken,
} from '../../services/commercetools';

describe('searching customers by email address', () => {
  describe('when the email addres is not found', () => {
    let client;
    beforeEach(() => {
      client = {
        execute: jest.fn(email =>
          Promise.resolve({ body: { statusCode: 200, results: [] } })
        ),
      };
    });
    test('email address not found', async () => {
      const res = await checkIfCustomerExists('test@devgurus.io', client);
      expect(res).toBeFalsy();
    });
  });
  describe('when the email addres is found', () => {
    let client;
    beforeEach(() => {
      client = {
        execute: jest.fn(email =>
          Promise.resolve({
            body: { statusCode: 200, results: [{ email }] },
          })
        ),
      };
    });
    test('email address found', async () => {
      const res = await checkIfCustomerExists('test@devgurus.io', client);
      expect(res).toBeTruthy();
    });
  });
});

describe('generating reset password token', () => {
  let client;
  beforeEach(() => {
    client = {
      execute: jest.fn(() =>
        Promise.resolve({
          body: { value: 'ABCDEFG123456789' },
        })
      ),
    };
  });
  test('token generated', async () => {
    const res = await generateResetPasswordToken('test@devgurus.io', client);
    expect(res).toBe('ABCDEFG123456789');
  });
});
