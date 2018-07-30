import { buildMessage } from '../../utils';

describe('building message', () => {
  describe('when no valid message received', () => {
    test('return null value', () => {
      expect(buildMessage({ type: 'NotValidType' })).toBeNull();
    });
  });
});
