import { Component, Input } from '@angular/core';

import { AbstractControl } from '@angular/forms';

@Component({
  selector: 'shared-form-error',
  standalone: true,
  imports: [],
  templateUrl: './form-error.component.html',
  styleUrl: './form-error.component.scss',
})
export class FormErrorComponent {
  @Input() control!: AbstractControl | null;
}
