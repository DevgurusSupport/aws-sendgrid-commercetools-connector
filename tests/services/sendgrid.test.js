import sgMail from '@sendgrid/mail';
import { sendEmail } from '../../services/sendgrid';

jest.mock('@sendgrid/mail', () => {
  return {
    setApiKey: jest.fn(),
    send: jest.fn(
      () =>
        new Promise(function(resolve, reject) {
          resolve({ message: 'All good!', code: 200 });
        })
    ),
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
    expect(sgMail.setApiKey).toHaveBeenCalledTimes(1);
  });

  describe('ignored message type received', () => {
    beforeEach(() => {
      global.console = { error: jest.fn(), warn: jest.fn(), info: jest.fn() };
    });
    test('sendEmail', async () => {
      const result = await sendEmail(mockMessage({ type: 'Other' }));
      expect(console.warn).toHaveBeenCalledTimes(1);
      expect(console.error).toHaveBeenCalledTimes(0);
      expect(sgMail.send).toHaveBeenCalledTimes(0);
    });
  });
  describe('when no errors in the send email operation', () => {
    let message;
    beforeEach(() => {
      global.console = { info: jest.fn(), error: jest.fn() };
      message = mockMessage();
    });
    test('sendEmail', async () => {
      const result = await sendEmail(mockMessage());
      expect(console.info).toHaveBeenCalledTimes(1);
      expect(console.info).toHaveBeenCalledWith('Email sent.');
      expect(console.error).toHaveBeenCalledTimes(0);
      expect(sgMail.send).toHaveBeenCalledTimes(1);
      expect(sgMail.send).toHaveBeenCalledWith({
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
  });

  describe('when some error in the send email operation occurs', () => {
    const error = { message: 'Error!', code: 500 };
    beforeEach(() => {
      global.console = { info: jest.fn(), error: jest.fn() };
      sgMail.send = jest.fn(
        () =>
          new Promise(function(resolve, reject) {
            reject(error);
          })
      );
    });
    test('sendEmail', async () => {
      const result = await sendEmail(mockMessage());
      expect(sgMail.send).toHaveBeenCalledTimes(1);
      expect(console.error).toHaveBeenCalledTimes(1);
      expect(console.error).toHaveBeenCalledWith(
        `Error ${error.message} with code ${error.code}`
      );
    });
  });
});
