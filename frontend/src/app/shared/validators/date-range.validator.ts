import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export const dateRangeValidator: ValidatorFn = (
  group: AbstractControl
): ValidationErrors | null => {
  const startDate = group.get('startDate')?.value;
  const endDate = group.get('endDate')?.value;

  if (startDate && endDate && new Date(endDate) < new Date(startDate)) {
    return { endDateInvalid: true };
  }

  return null;
};
