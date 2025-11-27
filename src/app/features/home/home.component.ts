import { Component, computed, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { VALIDATIONS } from '../../utils/validation';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  imports: [FormsModule],
})
export class HomeComponent {
  protected readonly inputValue = signal('');
  protected readonly validations = [
    VALIDATIONS.minLength({ parameters: { minLength: 9 } }),
    VALIDATIONS.maxLength({ parameters: { maxLength: 9 } }),
    VALIDATIONS.whitespaceEveryNthCharacter({ parameters: { nthCharacter: 3 } }),
    VALIDATIONS.numberOnly(),
    VALIDATIONS.isValidACNNumber(),
  ];
  protected readonly inputValueValidation = computed(() => {
    if (this.inputValue() === '')
      return {
        success: false,
        message: '',
      };
    for (const validation of this.validations) {
      if (!validation.validator(this.inputValue())) {
        return {
          success: false,
          message: validation.message,
        };
      }
    }

    return {
      success: true,
      message: 'Valid ACN Number',
    };
  });
  protected readonly inputValuValidationList = computed(() => {
    return this.validations.map((validation) => ({
      success: validation.validator(this.inputValue()),
      message: validation.name,
    }));
  });
}
