import { Injectable, Signal, computed } from '@angular/core';
import { TValidationReturn } from '../../utils/validation';

export type TValidationResult = {
  success: boolean;
  message: string;
};

export type TValidationConfig = {
  value: Signal<string>;
  validations: TValidationReturn[];
  successMessage?: string;
};

@Injectable()
export class ValidationService {
  private validations: TValidationReturn[] = [];
  private successMessage = 'Valid';
  private inputValueSignal!: Signal<string>;

  configure({ value, validations, successMessage }: TValidationConfig): void {
    this.inputValueSignal = value;
    this.validations = validations;
    this.successMessage = successMessage ?? this.successMessage;
  }

  readonly inputValueValidation = computed<TValidationResult>(() => {
    if (!this.inputValueSignal || this.inputValueSignal() === '') {
      return {
        success: false,
        message: '',
      };
    }

    for (const validation of this.validations) {
      if (!validation.validator(this.inputValueSignal())) {
        return {
          success: false,
          message: validation.message,
        };
      }
    }

    return {
      success: true,
      message: this.successMessage,
    };
  });

  readonly inputValueValidationList = computed<TValidationResult[]>(() => {
    if (!this.inputValueSignal) {
      return [];
    }

    return this.validations.map((validation) => ({
      success: validation.validator(this.inputValueSignal()),
      message: validation.name ?? '',
    }));
  });
}
