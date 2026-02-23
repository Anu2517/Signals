import { FormGroup, AbstractControl } from '@angular/forms';

export abstract class FormBase {
  abstract form: FormGroup;
  formSubmitted = false;

  get f(): { [key: string]: AbstractControl } {
    return this.form.controls;
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.form.get(fieldName);
    return !!field && field.invalid && (field.touched || this.formSubmitted);
  }

  validateForm(): boolean {
    this.formSubmitted = true;
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return false;
    }
    return true;
  }
}