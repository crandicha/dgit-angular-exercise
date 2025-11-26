import { Component, computed, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  imports: [FormsModule],
})
export class HomeComponent {
  protected readonly inputValue = signal('');
  protected readonly inputValueValidation = computed(() => {
    if (this.inputValue() === '')
      return {
        success: false,
        message: '',
      };

    return {
      success: true,
      message: 'Valid ACN Number',
    };
  });
}
