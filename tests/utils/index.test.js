import { buildMessage } from '../../utils';

describe('building message', () => {
  describe('when no valid message received', () => {
    beforeEach(() => {
      global.console = { warn: jest.fn() };
    });
    test('return null value', () => {
      expect(buildMessage({ type: 'NotValidType' })).toBeNull();
      expect(console.warn).toHaveBeenCalledTimes(1);
      expect(console.warn).toHaveBeenCalledWith(
        'Ignoring message: {"type":"NotValidType"}'
      );
    });
  });
  describe('when `CustomerCreated` type received', () => {
    expect(
      buildMessage({
        type: 'CustomerCreated',
        customer: { email: 'test@test.com', firstName: 'John' },
      })
    ).toEqual({
      from: undefined,
      html: 'Hey user, thanks for registering!',
      subject: 'Welcome John',
      to: 'test@test.com',
    });
  });
});
