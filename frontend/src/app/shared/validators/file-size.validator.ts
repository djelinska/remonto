import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function fileSizeValidator(maxSize: number): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const file = control.value;

    if (file && file.size > maxSize) {
      return { fileSize: { requiredSize: maxSize, actualSize: file.size } };
    }

    return null;
  };
}
