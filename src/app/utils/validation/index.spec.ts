import { describe, it, expect } from 'vitest';
import { VALIDATIONS } from './index';

describe('VALIDATIONS', () => {
  describe('minLength', () => {
    it('should validate minimum length with default parameter (1)', () => {
      const validation = VALIDATIONS.minLength();

      expect(validation.validator('a')).toBe(true);
      expect(validation.validator('abc')).toBe(true);
      expect(validation.validator('')).toBe(false);
    });

    it('should validate minimum length with custom parameter', () => {
      const validation = VALIDATIONS.minLength({ parameters: { minLength: 5 } });

      expect(validation.validator('12345')).toBe(true);
      expect(validation.validator('123456')).toBe(true);
      expect(validation.validator('1234')).toBe(false);
    });

    it('should ignore spaces when validating', () => {
      const validation = VALIDATIONS.minLength({ parameters: { minLength: 5 } });

      expect(validation.validator('1 2 3 4 5')).toBe(true);
      expect(validation.validator('1 2 3 4')).toBe(false);
    });

    it('should return default message', () => {
      const validation = VALIDATIONS.minLength({ parameters: { minLength: 5 } });

      expect(validation.message).toBe('Value must be at least 5 characters long');
    });

    it('should return custom message', () => {
      const validation = VALIDATIONS.minLength({
        parameters: { minLength: 5 },
        customMessage: 'Custom error message',
      });

      expect(validation.message).toBe('Custom error message');
    });
  });

  describe('maxLength', () => {
    it('should validate maximum length with default parameter (100)', () => {
      const validation = VALIDATIONS.maxLength();
      const longString = 'a'.repeat(100);
      const tooLongString = 'a'.repeat(101);

      expect(validation.validator(longString)).toBe(true);
      expect(validation.validator('abc')).toBe(true);
      expect(validation.validator(tooLongString)).toBe(false);
    });

    it('should validate maximum length with custom parameter', () => {
      const validation = VALIDATIONS.maxLength({ parameters: { maxLength: 5 } });

      expect(validation.validator('12345')).toBe(true);
      expect(validation.validator('1234')).toBe(true);
      expect(validation.validator('123456')).toBe(false);
    });

    it('should ignore spaces when validating', () => {
      const validation = VALIDATIONS.maxLength({ parameters: { maxLength: 5 } });

      expect(validation.validator('1 2 3 4 5')).toBe(true);
      expect(validation.validator('1 2 3 4 5 6')).toBe(false);
    });

    it('should return default message', () => {
      const validation = VALIDATIONS.maxLength({ parameters: { maxLength: 10 } });

      expect(validation.message).toBe('Value must be at most 10 characters long');
    });

    it('should return custom message', () => {
      const validation = VALIDATIONS.maxLength({
        parameters: { maxLength: 10 },
        customMessage: 'Too long!',
      });

      expect(validation.message).toBe('Too long!');
    });
  });

  describe('whitespaceEveryNthCharacter', () => {
    it('should validate whitespace pattern with default parameter (3)', () => {
      const validation = VALIDATIONS.whitespaceEveryNthCharacter();

      expect(validation.validator('abc')).toBe(true); // 1 group
      expect(validation.validator('abc def')).toBe(true); // 2 groups
      expect(validation.validator('abc def ghi')).toBe(true); // 3 groups
      expect(validation.validator('abc def ghi jkl')).toBe(true); // 4 groups
      expect(validation.validator('abcdefghi')).toBe(true); // no spaces is valid
      expect(validation.validator('ab cd ef')).toBe(false);
      expect(validation.validator('abcd efg hij')).toBe(false);
    });

    it('should validate whitespace pattern with custom parameter', () => {
      const validation = VALIDATIONS.whitespaceEveryNthCharacter({
        parameters: { nthCharacter: 2 },
      });

      expect(validation.validator('ab')).toBe(true); // 1 group
      expect(validation.validator('ab cd')).toBe(true); // 2 groups
      expect(validation.validator('ab cd ef')).toBe(true); // 3 groups
      expect(validation.validator('abcdef')).toBe(true); // no spaces
      expect(validation.validator('abc def')).toBe(false);
      expect(validation.validator('a bc')).toBe(false);
    });

    it('should return true when value has no spaces', () => {
      const validation = VALIDATIONS.whitespaceEveryNthCharacter();

      expect(validation.validator('abcdefghijklmnop')).toBe(true);
    });

    it('should return default message', () => {
      const validation = VALIDATIONS.whitespaceEveryNthCharacter({
        parameters: { nthCharacter: 4 },
      });

      expect(validation.message).toBe('Value must contain whitespace every 4 character');
    });

    it('should return custom message', () => {
      const validation = VALIDATIONS.whitespaceEveryNthCharacter({
        customMessage: 'Invalid format',
      });

      expect(validation.message).toBe('Invalid format');
    });
  });

  describe('numberOnly', () => {
    it('should validate numeric strings', () => {
      const validation = VALIDATIONS.numberOnly();

      expect(validation.validator('123')).toBe(true);
      expect(validation.validator('0')).toBe(true);
      expect(validation.validator('123.45')).toBe(true);
      expect(validation.validator('-123')).toBe(true);
    });

    it('should reject non-numeric strings', () => {
      const validation = VALIDATIONS.numberOnly();

      expect(validation.validator('abc')).toBe(false);
      expect(validation.validator('12a34')).toBe(false);
      expect(validation.validator('12.34.56')).toBe(false);
    });

    it('should handle spaces by removing them', () => {
      const validation = VALIDATIONS.numberOnly();

      expect(validation.validator('1 2 3')).toBe(true);
      expect(validation.validator('1 2 a')).toBe(false);
    });

    it('should return default message', () => {
      const validation = VALIDATIONS.numberOnly();

      expect(validation.message).toBe('Value must be a number');
    });

    it('should return custom message', () => {
      const validation = VALIDATIONS.numberOnly({
        customMessage: 'Numbers only please',
      });

      expect(validation.message).toBe('Numbers only please');
    });
  });

  describe('isValidACNNumber', () => {
    it('should validate correct ACN numbers', () => {
      const validation = VALIDATIONS.isValidACNNumber();

      // Valid ACN examples (using the checksum algorithm)
      expect(validation.validator('000000019')).toBe(true); // 9-digit ACN
      expect(validation.validator('004085616')).toBe(true);
      expect(validation.validator('010499966')).toBe(true);
    });

    it('should reject invalid ACN numbers', () => {
      const validation = VALIDATIONS.isValidACNNumber();

      expect(validation.validator('000000018')).toBe(false); // wrong checksum
      expect(validation.validator('004085615')).toBe(false);
      expect(validation.validator('123456789')).toBe(false);
    });

    it('should handle spaces by removing them', () => {
      const validation = VALIDATIONS.isValidACNNumber();

      expect(validation.validator('000 000 019')).toBe(true);
      expect(validation.validator('004 085 616')).toBe(true);
    });

    it('should return default message', () => {
      const validation = VALIDATIONS.isValidACNNumber();

      expect(validation.message).toBe('Value is not a valid ACN number');
    });

    it('should return custom message', () => {
      const validation = VALIDATIONS.isValidACNNumber({
        customMessage: 'Invalid ACN',
      });

      expect(validation.message).toBe('Invalid ACN');
    });

    it('should validate ACN checksum algorithm correctly', () => {
      const validation = VALIDATIONS.isValidACNNumber();
      expect(validation.validator('000000019')).toBe(true);
    });
  });
});
