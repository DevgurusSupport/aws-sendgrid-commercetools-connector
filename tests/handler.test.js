import * as handler from '../handler';
import { sendEmail } from '../services/sendgrid';
import {
  checkIfCustomerExists,
  generateResetPasswordToken,
} from '../services/commercetools';

jest.mock('../services/sendgrid', () => {
  return { sendEmail: jest.fn() };
});

jest.mock('../services/commercetools', () => {
  return {
    checkIfCustomerExists: jest.fn(() => Promise.resolve(false)),
    generateResetPasswordToken: jest.fn(() => Promise.resolve('token12345678')),
  };
});

const clearMocks = () => {
  sendEmail.mockClear();
  checkIfCustomerExists.mockClear();
  generateResetPasswordToken.mockClear();
};

describe('calling the lambda function', () => {
  describe('when invalid message received', () => {
    let event;
    beforeEach(async () => {
      clearMocks();
      global.console = { error: jest.fn() };
      event = { Records: [{ Sns: { Message: null } }] };
      await handler.lambda(event);
    });
    test('show an error', () => {
      expect(console.error).toHaveBeenCalledTimes(1);
      expect(console.error).toHaveBeenCalledWith(
        `Could not extract the message from the event: ${JSON.stringify(event)}`
      );
    });
    test('send email not called and error logged', async () => {
      expect(sendEmail).not.toHaveBeenCalled();
    });
  });

  describe('when valid message received', () => {
    let event;
    beforeEach(async () => {
      clearMocks();
      global.console = { error: jest.fn() };
      event = { Records: [{ Sns: { Message: '{ "type": "test" }' } }] };
      await handler.lambda(event);
    });
    test('no errors shown', () => {
      expect(console.error).not.toHaveBeenCalled();
    });
    test('send email function called', async () => {
      expect(sendEmail).toHaveBeenCalledTimes(1);
      expect(sendEmail).toHaveBeenCalledWith({
        fromEmail: undefined,
        type: 'test',
      });
    });
  });
});

describe('calling the reset password function', () => {
  describe('when email not found', () => {
    let event;
    let email;
    let response;
    beforeEach(async () => {
      clearMocks();
      email = 'test@devgurus.io';
      event = { body: `{ "email": "${email}" }` };
      response = await handler.resetPassword(event);
    });
    test('call the checkIfCustomerExists function', () => {
      expect(checkIfCustomerExists).toHaveBeenCalledTimes(1);
      expect(checkIfCustomerExists).toHaveBeenCalledWith(
        email,
        expect.anything()
      );
    });
    test('function generateResetPasswordToken is not called', () => {
      expect(generateResetPasswordToken).not.toHaveBeenCalled();
    });
    test('function sendEmail is not called', () => {
      expect(sendEmail).not.toHaveBeenCalled();
    });
    test('return 404 response when customer not found', () => {
      expect(response).toEqual({
        body: `{"message":"Customer ${email} not found!"}`,
        statusCode: 404,
      });
    });
  });

  describe('when the email is found', () => {
    let event;
    let email;
    let response;
    beforeEach(async () => {
      clearMocks();
      checkIfCustomerExists.mockImplementation(
        jest.fn(() => Promise.resolve(true))
      );
      email = 'test@devgurus.io';
      event = { body: `{ "email": "${email}" }` };
      response = await handler.resetPassword(event);
    });
    test('call the checkIfCustomerExists function', () => {
      expect(checkIfCustomerExists).toHaveBeenCalledTimes(1);
      expect(checkIfCustomerExists).toHaveBeenCalledWith(
        email,
        expect.anything()
      );
    });
    test('function generateResetPasswordToken is called', () => {
      expect(generateResetPasswordToken).toHaveBeenCalledTimes(1);
      expect(generateResetPasswordToken).toHaveBeenCalledWith(
        email,
        expect.anything()
      );
    });
    test('function sendEmail is called', () => {
      expect(sendEmail).toHaveBeenCalledTimes(1);
      expect(sendEmail).toHaveBeenCalledWith({
        email,
        fromEmail: undefined,
        resetPasswordUrlPrefix: undefined,
        token: 'token12345678',
        type: 'ResetPassword',
      });
    });
    test('return 200 response when customer found and password reset', () => {
      expect(response).toEqual({
        body: '{"message":"Reset password request completed"}',
        statusCode: 200,
      });
    });
  });

  describe('when some exception is thrown', () => {
    let event;
    let email;
    let response;
    beforeEach(async () => {
      clearMocks();
      checkIfCustomerExists.mockImplementation(
        jest.fn(() => {
          throw Error('Some important error');
        })
      );
      email = 'test@devgurus.io';
      event = { body: `{ "email": "${email}" }` };
      response = await handler.resetPassword(event);
    });
    test('return 500 response when an exception is thrown', () => {
      expect(response).toEqual({
        body: '{"message":"Some unexpected error occured, check logs"}',
        statusCode: 500,
      });
    });
  });
});
