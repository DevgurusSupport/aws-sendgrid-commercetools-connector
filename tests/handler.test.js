import * as handler from '../handler';
import { sendEmail } from '../services/sendgrid';

jest.mock('../services/sendgrid', () => {
  return { sendEmail: jest.fn() };
});

describe('calling the lambda function', () => {
  describe('when invalid message came', () => {
    let event;
    beforeEach(() => {
      global.console = { error: jest.fn() };
      event = { Records: [{ Sns: { Message: null } }] };
    });
    test('invalid message', async () => {
      await handler.lambda(event);
      expect(console.error).toHaveBeenCalledTimes(1);
      expect(sendEmail).toHaveBeenCalledTimes(0);
    });
  });

  describe('when valid message came', () => {
    let event;
    beforeEach(() => {
      global.console = { error: jest.fn() };
      event = { Records: [{ Sns: { Message: '{ "type": "test" }' } }] };
    });
    test('invalid message', async () => {
      await handler.lambda(event);
      expect(console.error).toHaveBeenCalledTimes(0);
      expect(sendEmail).toHaveBeenCalledTimes(1);
    });
  });
});
