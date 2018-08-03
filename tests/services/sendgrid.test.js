import { send, setApiKey } from '@sendgrid/mail';
import { sendEmail } from '../../services/sendgrid';

jest.mock('@sendgrid/mail', () => {
  return {
    setApiKey: jest.fn(),
    send: jest.fn(() => Promise.resolve({ message: 'All good!', code: 200 })),
  };
});

const mockMessage = data => ({
  type: 'CustomerCreated',
  customer: { email: 'test@test.com', firstName: 'Test' },
  fromEmail: 'test@test.io',
  ...data,
});

describe('calling the send email function', () => {
  test('set the API Key value for the sendgrid client', () => {
    expect(setApiKey).toHaveBeenCalledTimes(1);
  });

  describe('ignored message type received', () => {
    let populateExceptionFn;
    beforeEach(async () => {
      send.mockClear();
      global.console = { error: jest.fn(), warn: jest.fn(), info: jest.fn() };
      populateExceptionFn = jest.fn();
      await sendEmail(mockMessage({ type: 'Other' }), populateExceptionFn);
    });
    test('send email function not called', () => {
      expect(send).not.toHaveBeenCalled();
    });
    test('show an warning log informing about the ignored type', () => {
      expect(console.warn).toHaveBeenCalledTimes(1);
    });
    test('do not show any error log', () => {
      expect(console.error).not.toHaveBeenCalled();
    });
    test('no exception occurs', () => {
      expect(populateExceptionFn).not.toHaveBeenCalled();
    });
  });
  describe('when no errors in the send email operation', () => {
    let message;
    let populateExceptionFn;
    beforeEach(async () => {
      send.mockClear();
      global.console = { info: jest.fn(), error: jest.fn() };
      message = mockMessage();
      populateExceptionFn = jest.fn();
      await sendEmail(mockMessage(), populateExceptionFn);
    });
    test('send email function called', () => {
      expect(send).toHaveBeenCalledTimes(1);
      expect(send).toHaveBeenCalledWith({
        from: message.fromEmail,
        html: 'Hey user, thanks for registering!',
        subject: `Welcome ${message.customer.firstName}`,
        substitutions: {
          email: message.customer.email,
          firstName: message.customer.firstName,
        },
        to: message.customer.email,
      });
    });
    test('show log info when email is sent', () => {
      expect(console.info).toHaveBeenCalledTimes(1);
      expect(console.info).toHaveBeenCalledWith('Email sent.');
    });
    test('do not show any error log', () => {
      expect(console.error).not.toHaveBeenCalled();
    });
    test('no exception occurs', () => {
      expect(populateExceptionFn).not.toHaveBeenCalled();
    });
  });

  describe('when some error in the send email operation occurs', () => {
    const error = { message: 'Error!', code: 500 };
    let populateExceptionFn;
    beforeEach(async () => {
      send.mockClear();
      global.console = { info: jest.fn(), error: jest.fn() };
      send.mockImplementation(
        jest.fn(
          () =>
            new Promise(function(resolve, reject) {
              reject(error);
            })
        )
      );
      populateExceptionFn = jest.fn();
      await sendEmail(mockMessage(), populateExceptionFn);
    });
    test('send email function called', () => {
      expect(send).toHaveBeenCalledTimes(1);
    });
    test('populate exception function is called', () => {
      expect(populateExceptionFn).toHaveBeenCalledTimes(1);
      expect(populateExceptionFn).toHaveBeenCalledWith({
        code: 500,
        message: 'Error!',
      });
    });
  });
});
