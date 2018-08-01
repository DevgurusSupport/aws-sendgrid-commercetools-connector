import * as handler from '../handler';
import { sendEmail } from '../services/sendgrid';

jest.mock('../services/sendgrid', () => {
  return { sendEmail: jest.fn() };
});

describe('calling the lambda function', () => {
  describe('when invalid message received', () => {
    let event;
    beforeEach(() => {
      global.console = { error: jest.fn() };
      event = { Records: [{ Sns: { Message: null } }] };
    });
    test('send email not called and error logged', async () => {
      await handler.lambda(event);
      expect(console.error).toHaveBeenCalledTimes(1);
      expect(sendEmail).toHaveBeenCalledTimes(0);
    });
  });

  describe('when valid message received', () => {
    let event;
    beforeEach(() => {
      global.console = { error: jest.fn() };
      event = { Records: [{ Sns: { Message: '{ "type": "test" }' } }] };
    });
    test('send email function called', async () => {
      await handler.lambda(event);
      expect(console.error).toHaveBeenCalledTimes(0);
      expect(sendEmail).toHaveBeenCalledTimes(1);
    });
  });
});
