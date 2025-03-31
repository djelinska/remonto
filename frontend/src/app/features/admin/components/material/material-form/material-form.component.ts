import { Component, EventEmitter, Input, Output } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

import { FormErrorComponent } from '../../../../../shared/components/form-error/form-error.component';
import { MaterialUnit } from '../../../../../shared/enums/material-unit';

@Component({
  selector: 'app-material-form',
  standalone: true,
  imports: [ReactiveFormsModule, FormErrorComponent],
  templateUrl: './material-form.component.html',
  styleUrl: './material-form.component.scss',
})
export class MaterialFormComponent {
  @Input() materialForm!: FormGroup;
  @Input() materialIndex!: number;
  @Output() removeMaterial = new EventEmitter<void>();

  units = Object.keys(MaterialUnit);
  unitLabels: Record<string, string> = MaterialUnit;

  static createMaterialForm(): FormGroup {
    return new FormBuilder().group({
      name: [
        '',
        [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(50),
        ],
      ],
      quantity: [0, Validators.min(0)],
      unit: [null],
      type: [''],
      note: [''],
    });
  }

  onRemoveMaterial() {
    this.removeMaterial.emit();
  }
}
