import { describe, it, expect, beforeEach } from 'vitest';
import { signal } from '@angular/core';
import { ValidationService } from './validation.service';
import { VALIDATIONS } from '../../utils/validation';

describe('ValidationService', () => {
  let service: ValidationService;
  let inputValue = signal('');

  beforeEach(() => {
    service = new ValidationService();
    inputValue = signal('');
    service.configure(inputValue, [
      VALIDATIONS.minLength({ parameters: { minLength: 9 } }),
      VALIDATIONS.maxLength({ parameters: { maxLength: 9 } }),
      VALIDATIONS.whitespaceEveryNthCharacter({ parameters: { nthCharacter: 3 } }),
      VALIDATIONS.numberOnly(),
      VALIDATIONS.isValidACNNumber(),
    ]);
  });

  it('should create', () => {
    expect(service).toBeTruthy();
  });

  describe('configure', () => {
    it('should accept input value signal and validations', () => {
      const testInputValue = signal('test');
      const testValidations = [VALIDATIONS.numberOnly()];

      expect(() => service.configure(testInputValue, testValidations)).not.toThrow();
    });
  });

  describe('inputValueValidation computed', () => {
    it('should return not success with empty message for empty input', () => {
      inputValue.set('');
      const result = service.inputValueValidation();

      expect(result.success).toBe(false);
      expect(result.message).toBe('');
    });

    it('should return error for input that is too short', () => {
      inputValue.set('12345678');
      const result = service.inputValueValidation();

      expect(result.success).toBe(false);
      expect(result.message).toContain('at least 9');
    });

    it('should return error for input that is too long', () => {
      inputValue.set('1234567890');
      const result = service.inputValueValidation();

      expect(result.success).toBe(false);
      expect(result.message).toContain('at most 9');
    });

    it('should return error for input without proper whitespace pattern', () => {
      inputValue.set('1234 567 89'); // Wrong spacing (4-3-2 instead of 3-3-3)
      const result = service.inputValueValidation();

      expect(result.success).toBe(false);
      expect(result.message).toContain('whitespace every 3');
    });

    it('should return error for non-numeric input', () => {
      inputValue.set('abc def ghi');
      const result = service.inputValueValidation();

      expect(result.success).toBe(false);
      expect(result.message).toContain('number');
    });

    it('should return error for invalid ACN number', () => {
      inputValue.set('123 456 789');
      const result = service.inputValueValidation();

      expect(result.success).toBe(false);
      expect(result.message).toContain('valid ACN');
    });

    it('should return success for valid ACN number', () => {
      inputValue.set('000 000 019');
      const result = service.inputValueValidation();

      expect(result.success).toBe(true);
      expect(result.message).toBe('Valid ACN Number');
    });

    it('should return success for another valid ACN number', () => {
      inputValue.set('004 085 616');
      const result = service.inputValueValidation();

      expect(result.success).toBe(true);
      expect(result.message).toBe('Valid ACN Number');
    });
  });

  describe('inputValueValidationList computed', () => {
    it('should return all validations with their status', () => {
      inputValue.set('000 000 019');
      const list = service.inputValueValidationList();

      expect(list).toHaveLength(5);
      expect(list.every((item) => item.success)).toBe(true);
    });

    it('should show which validations fail', () => {
      inputValue.set('1234 567 89'); // Wrong spacing pattern (4-3-2 instead of 3-3-3)
      const list = service.inputValueValidationList();

      expect(list).toHaveLength(5);

      // Should pass minLength (has 9 characters without spaces)
      const minLengthValidation = list.find((v) => v.message?.includes('minLength'));
      expect(minLengthValidation?.success).toBe(true);

      // Should pass maxLength (has 9 characters without spaces)
      const maxLengthValidation = list.find((v) => v.message?.includes('maxLength'));
      expect(maxLengthValidation?.success).toBe(true);

      // Should fail whitespace pattern (4-3-2 instead of 3-3-3)
      const whitespaceValidation = list.find((v) => v.message?.includes('whitespace'));
      expect(whitespaceValidation?.success).toBe(false);

      // Should pass numberOnly
      const numberOnlyValidation = list.find((v) => v.message?.includes('numberOnly'));
      expect(numberOnlyValidation?.success).toBe(true);
    });

    it('should reactively update when input changes', () => {
      inputValue.set('abc');
      let list = service.inputValueValidationList();
      expect(list.every((item) => item.success)).toBe(false);

      inputValue.set('000 000 019');
      list = service.inputValueValidationList();
      expect(list.every((item) => item.success)).toBe(true);
    });
  });
});
