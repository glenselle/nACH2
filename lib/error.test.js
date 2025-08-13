const nACHError = require("./error");

describe('error.js', () => {
  describe('nACHError', () => {
    it('should create an error with correct name and message', () => {
      const error = new nACHError({ name: 'TestError', message: 'This is a test error.' });
      expect(error.name).toBe('nACHError[TestError]');
      expect(error.message).toBe('This is a test error.');
    });

    it('should inherit from Error', () => {
      const error = new nACHError({ name: 'TestError', message: 'This is a test error.' });
      expect(error instanceof Error).toBe(true);
    });

    it('should have a default name if not provided', () => {
      const error = new nACHError({});
      expect(error.name).toBe('nACHError');
    });
  })
})