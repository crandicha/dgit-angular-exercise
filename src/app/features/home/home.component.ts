import { Component, signal, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ValidationService } from '../../services/validation/validation.service';
import { VALIDATIONS } from '../../utils/validation';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  imports: [FormsModule],
  providers: [ValidationService],
})
export class HomeComponent {
  protected readonly validationService = inject(ValidationService);
  protected readonly inputValue = signal('');

  private readonly validations = [
    VALIDATIONS.minLength({ parameters: { minLength: 9 } }),
    VALIDATIONS.maxLength({ parameters: { maxLength: 9 } }),
    VALIDATIONS.whitespaceEveryNthCharacter({ parameters: { nthCharacter: 3 } }),
    VALIDATIONS.numberOnly(),
    VALIDATIONS.isValidACNNumber(),
  ];

  constructor() {
    this.validationService.configure({
      validations: this.validations,
      value: this.inputValue,
      successMessage: 'Valid ACN Number',
    });
  }

  protected get inputValueValidation() {
    return this.validationService.inputValueValidation;
  }

  protected get inputValueValidationList() {
    return this.validationService.inputValueValidationList;
  }
}
