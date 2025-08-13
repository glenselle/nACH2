const validate = require('./validate');
const nACHError = require('./error');

describe('validate.js', () => {
  describe('validateRequiredFields', () => {
    it('should return true for all required fields present', () => {
      const obj = { a: { required: true, value: 'x', name: 'a' }, b: { required: false, value: '', name: 'b' } };
      expect(validate.validateRequiredFields(obj)).toBe(true);
    });
    it('should throw for missing required field', () => {
      const obj = { a: { required: true, value: '', name: 'a' } };
      expect(() => validate.validateRequiredFields(obj)).toThrow(nACHError);
    });
  });

  describe('validateLengths', () => {
    it('should return true for valid lengths', () => {
      const obj = { a: { value: '123', width: 3, name: 'a' } };
      expect(validate.validateLengths(obj)).toBe(true);
    });
    it('should throw for invalid length', () => {
      const obj = { a: { value: '1234', width: 3, name: 'a' } };
      expect(() => validate.validateLengths(obj)).toThrow(nACHError);
    });
  });

  describe('validateDataTypes', () => {
    it('should validate numeric, alpha, and alphanumeric types', () => {
      const obj = {
        n: { type: 'numeric', value: '123', name: 'n' },
        a: { type: 'alpha', value: 'abc', name: 'a' },
        an: { type: 'alphanumeric', value: 'abc123!@#', name: 'an' }
      };
      expect(validate.validateDataTypes(obj)).toBe(true);
    });
    it('should throw for invalid type', () => {
      const obj = { n: { type: 'numeric', value: 'abc', name: 'n' } };
      expect(() => validate.validateDataTypes(obj)).toThrow(nACHError);
    });
  });

  describe('validateACHAddendaTypeCode', () => {
    it('should return true for valid code', () => {
      expect(validate.validateACHAddendaTypeCode('05')).toBe(true);
    });
    it('should throw for invalid code', () => {
      expect(() => validate.validateACHAddendaTypeCode('01')).toThrow(nACHError);
    });
  });

  describe('validateACHCode', () => {
    it('should return true for valid code', () => {
      expect(validate.validateACHCode('22')).toBe(true);
    });
    it('should throw for invalid code', () => {
      expect(() => validate.validateACHCode('99')).toThrow(nACHError);
    });
  });

  describe('validateACHServiceClassCode', () => {
    it('should return true for valid code', () => {
      expect(validate.validateACHServiceClassCode('200')).toBe(true);
    });
    it('should throw for invalid code', () => {
      expect(() => validate.validateACHServiceClassCode('999')).toThrow(nACHError);
    });
  });

  describe('validateRoutingNumber', () => {
    it('should return true for valid routing number', () => {
      expect(validate.validateRoutingNumber('011000015')).toBe(true);
    });
    it('should throw for invalid length', () => {
      expect(() => validate.validateRoutingNumber('01100001')).toThrow(nACHError);
    });
    it('should throw for invalid checksum', () => {
      expect(() => validate.validateRoutingNumber('011000016')).toThrow(nACHError);
    });
  });

  describe('getNextMultipleDiff', () => {
    it('should return the difference to next multiple', () => {
      expect(validate.getNextMultipleDiff(7, 5)).toBe(3);
    });
  });
});
