const utils = require('./utils');
const nACHError = require('./error');

describe('utils.js', () => {
  describe('pad', () => {
    test('pads string to the right with spaces by default', () => {
      expect(utils.pad('test', 8)).toBe('test    ');
    });

    test('pads string to the left with default and custom characters', () => {
      expect(utils.pad('123', 5, false)).toBe('  123');
      expect(utils.pad('123', 5, false, '0')).toBe('00123');
    });
    
    test('pads string to the left with custom character even if the arguments are flipped (DEPRECATION PLANNED)', () => {
      expect(utils.pad('123', 5, '0', false)).toBe('00123');
    });
  });

  describe('computeCheckDigit', () => {
    test('computes correct check digit for 8-digit routing number', () => {
      expect(utils.computeCheckDigit('09100002')).toBe('091000022');
    });

    test('returns original if not 8 digits', () => {
      expect(utils.computeCheckDigit('12500')).toBe('12500');
    });
  });

  describe('testRegex', () => {
    test('validates field value against regex', () => {
      const field = { name: 'test', value: '123', type: 'numeric' };
      expect(() => utils.testRegex(/^\d+$/, field)).not.toThrow();
    });

    test('throws error for invalid field value', () => {
      const field = { name: 'test', value: 'abc', type: 'numeric' };
      expect(() => utils.testRegex(/^\d+$/, field)).toThrow(nACHError);
    });
  });

  describe('generateString', () => {
    test('generates padded string from object with positions', (done) => {
      const obj = {
        field1: { position: 1, value: '123', width: 5, type: 'numeric', paddingChar: '0' },
        field2: { position: 2, value: 'ABC', width: 5, type: 'alphanumeric' }
      };
      utils.generateString(obj, (result) => {
        expect(result).toBe('00123ABC  ');
        done();
      });
    });
  });

  describe('unique', () => {
    test('returns incrementing counter value', () => {
      const first = utils.unique();
      const second = utils.unique();
      expect(second).toBe(first + 1);
    });
  });

  describe('overrideLowLevel', () => {
    test('overrides values in target object', () => {
      const self = { set: jest.fn() };
      const options = { field1: 'value1', field2: 'value2' };
      const values = ['field1', 'field2'];
      utils.overrideLowLevel(values, options, self);
      expect(self.set).toHaveBeenCalledWith('field1', 'value1');
      expect(self.set).toHaveBeenCalledWith('field2', 'value2');
    });
  });

  describe('getNextMultiple', () => {
    test('returns next multiple of given number', () => {
      expect(utils.getNextMultiple(7, 5)).toBe(10);
      expect(utils.getNextMultiple(10, 5)).toBe(10);
    });
  });

  describe('getNextMultipleDiff', () => {
    test('returns difference to next multiple', () => {
      expect(utils.getNextMultipleDiff(7, 5)).toBe(3);
      expect(utils.getNextMultipleDiff(10, 5)).toBe(0);
    });
  });

  describe('formatDate', () => {
    test('formats date to YYMMDD', () => {
      const date = new Date(2025, 0, 15); // January 15, 2025
      expect(utils.formatDate(date)).toBe('250115');
    });
  });

  describe('formatTime', () => {
    test('formats time to HHMM', () => {
      const date = new Date(2025, 0, 15, 14, 30); // 2:30 PM
      expect(utils.formatTime(date)).toBe('1430');
    });
  });

  describe('isBusinessDay', () => {
    test('identifies business days correctly', () => {
      // Wednesday (business day)
      expect(utils.isBusinessDay(new Date(2025, 0, 15))).toBe(true);
      // Sunday (not a business day)
      expect(utils.isBusinessDay(new Date(2025, 0, 19))).toBe(false);
    });
  });

  describe('computeBusinessDay', () => {
    test('computes correct future business day from today', () => {
      // Add 3 business days
      const computed = utils.computeBusinessDay(3);
      expect(computed.getDate()).toEqual((new Date()).getDate() + 3);
    });

    test('computes correct future business day from a startDate', () => {
      const startDate = new Date(2025, 0, 15); // Wednesday
      // Add 3 business days from startDate
      const expected = new Date(2025, 0, 20); // Should be Monday
      expect(utils.computeBusinessDay(3, startDate)).toEqual(expected);
    });
  });

  describe('newLineChar', () => {
    test('returns CRLF', () => {
      expect(utils.newLineChar()).toBe('\r\n');
    });
  });
});