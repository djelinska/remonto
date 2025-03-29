import { Component, EventEmitter, Input, Output } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

import { FormErrorComponent } from '../../../../../shared/components/form-error/form-error.component';

@Component({
  selector: 'app-tool-form',
  standalone: true,
  imports: [ReactiveFormsModule, FormErrorComponent],
  templateUrl: './tool-form.component.html',
  styleUrl: './tool-form.component.scss',
})
export class ToolFormComponent {
  @Input() toolForm!: FormGroup;
  @Input() toolIndex!: number;
  @Output() removeTool = new EventEmitter<void>();

  static createToolForm(): FormGroup {
    return new FormBuilder().group({
      name: [
        '',
        [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(50),
        ],
      ],
      quantity: [1, Validators.min(1)],
      note: [''],
    });
  }

  onRemoveTool() {
    this.removeTool.emit();
  }
}
