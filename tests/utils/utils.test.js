import { buildMessage } from '../../utils';

describe('building message to be sent', () => {
  describe('when no supported type received', () => {
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

  describe('when `OrderCreated` type received', () => {
    const orderCreatedMessage = {
      type: 'OrderCreated',
      order: {
        customerEmail: 'test@test.com',
        orderNumber: 'TEST000012345',
        totalPrice: {
          currencyCode: 'EUR',
          centAmount: 1000,
        },
      },
      fromEmail: 'test@test.io',
    };
    test('return order created message', () => {
      expect(buildMessage(orderCreatedMessage)).toEqual({
        from: orderCreatedMessage.fromEmail,
        html: 'Order successfully created!',
        subject: `Your order ${orderCreatedMessage.order.orderNumber}`,
        substitutions: orderCreatedMessage.order,
        to: orderCreatedMessage.order.customerEmail,
      });
    });
  });

  describe('when `ResetPassword` type received', () => {
    const resetPasswordMessage = {
      type: 'ResetPassword',
      email: 'test@test.com',
      token: 'abcdefghi123456',
      fromEmail: 'test@test.io',
      resetPasswordUrlPrefix: 'https://test.io/reset/password/',
    };
    test('return reset password message', () => {
      expect(buildMessage(resetPasswordMessage)).toEqual({
        from: resetPasswordMessage.fromEmail,
        html: `Here is the link to reset your password <a>${
          resetPasswordMessage.resetPasswordUrlPrefix
        }${resetPasswordMessage.token}</a>`,
        subject: 'Reset Password',
        substitutions: {
          email: resetPasswordMessage.email,
          token: resetPasswordMessage.token,
        },
        to: resetPasswordMessage.email,
      });
    });
  });
});
