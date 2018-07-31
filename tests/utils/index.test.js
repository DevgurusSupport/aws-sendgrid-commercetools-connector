import { buildMessage } from '../../utils';

describe('building message', () => {
  describe('when no valid message received', () => {
    const invalidMessage = { type: 'NotValidType' };
    beforeEach(() => {
      global.console = { warn: jest.fn() };
    });
    test('return null value', () => {
      expect(buildMessage(invalidMessage)).toBeNull();
      expect(console.warn).toHaveBeenCalledTimes(1);
      expect(console.warn).toHaveBeenCalledWith(
        `Ignoring message: ${JSON.stringify(invalidMessage)}`
      );
    });
  });
  describe('when `CustomerCreated` type received', () => {
    const customerCreatedMessage = {
      type: 'CustomerCreated',
      customer: { email: 'test@test.com', firstName: 'John' },
      fromEmail: 'test@test.io',
    };
    test('return customer created message', () => {
      expect(buildMessage(customerCreatedMessage)).toEqual({
        from: customerCreatedMessage.fromEmail,
        html: 'Hey user, thanks for registering!',
        subject: `Welcome ${customerCreatedMessage.customer.firstName}`,
        substitutions: customerCreatedMessage.customer,
        to: customerCreatedMessage.customer.email,
      });
    });
  });
});
