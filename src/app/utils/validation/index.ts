type TValidationReturn = {
  validator: (value: string) => boolean;
  message: string;
};

type TValidationProps<T = void> = T extends void
  ? { customMessage?: string }
  : { customMessage?: string; parameters?: T };

type TValidationFunction<T = void> = (props?: TValidationProps<T>) => TValidationReturn;

export const VALIDATIONS = {
  minLength: ({ parameters, customMessage }: TValidationProps<{ minLength?: number }> = {}) => {
    const { minLength = 1 } = parameters ?? {};
    return {
      validator: (value: string) => value.replaceAll(' ', '').length >= minLength,
      message: customMessage || `Value must be at least ${minLength} characters long`,
    };
  },
  maxLength: ({ parameters, customMessage }: TValidationProps<{ maxLength?: number }> = {}) => {
    const { maxLength = 100 } = parameters ?? {};
    return {
      validator: (value: string) => value.replaceAll(' ', '').length <= maxLength,
      message: customMessage || `Value must be at most ${maxLength} characters long`,
    };
  },
  whitespaceEveryNthCharacter: ({
    parameters,
    customMessage,
  }: TValidationProps<{ nthCharacter?: number }> = {}) => {
    const { nthCharacter = 3 } = parameters ?? {};
    return {
      validator: (value: string) => {
        if (!value.includes(' ')) return true;
        return !!value.match(
          new RegExp(`^\\w{${nthCharacter}} \\w{${nthCharacter}} \\w{${nthCharacter}}$`)
        );
      },
      message: customMessage || `Value must contain whitespace every ${nthCharacter} character`,
    };
  },
  numberOnly: ({ customMessage }: TValidationProps<void> = {}) => ({
    validator: (value: string) => !isNaN(Number(value.replaceAll(' ', ''))),
    message: customMessage || 'Value must be a number',
  }),
  isValidACNNumber: ({ customMessage }: TValidationProps<void> = {}) => ({
    validator: (value: string) => {
      const parsedValue = value.replaceAll(' ', '');

      const numbers = parsedValue.split('').map(Number);
      const lastNumber = numbers[numbers.length - 1];
      const otherNumbers = numbers.slice(0, numbers.length - 1);
      const maxWeight = numbers.length - 1;

      const numberSum = otherNumbers.reduce((acc, curr, index) => {
        return acc + curr * (maxWeight - index);
      }, 0);
      const remainder = numberSum % 10;
      const calculatedNumber = (10 - remainder) % 10;

      return calculatedNumber === lastNumber;
    },
    message: customMessage || 'Value is not a valid ACN number',
  }),
} satisfies Record<string, TValidationFunction<any>>;
