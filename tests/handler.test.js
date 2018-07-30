import sgMail from '@sendgrid/mail';
import * as handler from '../handler';

jest.mock('@sendgrid/mail', () => {
  return {
    setApiKey: jest.fn(),
    send: jest.fn().mockImplementation(
      () =>
        new Promise(function(resolve, reject) {
          resolve({ message: 'All good!', code: 200 });
        })
    ),
  };
});

const sendEmail = async () => {
  const event = { Records: [{ Sns: { Message: 'Message' } }] };
  const context = 'context';

  return await handler.sendEmail(event, context);
};

describe('calling the send email function', () => {
  describe('when no errors in the send operation', () => {
    beforeEach(() => {
      global.console = { info: jest.fn(), error: jest.fn() };
      sgMail.send.mockClear();
    });
    test('sendEmail', async () => {
      const result = await sendEmail();
      expect(result).toBeTruthy();
      expect(console.info).toHaveBeenCalledTimes(2);
      expect(console.info).toHaveBeenCalledWith('Sending the email...');
      expect(console.info).toHaveBeenCalledWith('Email sent.');
      expect(console.error).toHaveBeenCalledTimes(0);
    });
  });

  describe('when some error in the send operation occurs', () => {
    beforeEach(() => {
      global.console = { info: jest.fn(), error: jest.fn() };
      sgMail.send.mockImplementation(
        () =>
          new Promise(function(resolve, reject) {
            reject({ message: 'Error!', code: 500 });
          })
      );
    });
    test('sendEmail', async () => {
      const result = await sendEmail();
      expect(result).toBeFalsy();
      expect(console.info).toHaveBeenCalledTimes(1);
      expect(console.error).toHaveBeenCalledTimes(1);
      expect(console.info).toHaveBeenCalledWith('Sending the email...');
      expect(console.error).toHaveBeenCalledWith('Error Error! with code 500');
    });
  });
});
