import { Component, EventEmitter, Input, Output } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

import { BsModalRef } from 'ngx-bootstrap/modal';
import { ElementStatus } from '../../../../../shared/enums/element-status';
import { FormErrorComponent } from '../../../../../shared/components/form-error/form-error.component';
import { ToolDto } from '../../../../../shared/models/tool.dto';
import { ToolFormDto } from '../../../../../core/services/tool/models/tool-form.dto';

@Component({
  selector: 'app-tool-form',
  standalone: true,
  imports: [FormErrorComponent, ReactiveFormsModule],
  templateUrl: './tool-form.component.html',
  styleUrl: './tool-form.component.scss',
})
export class ToolFormComponent {
  @Input() tool: ToolDto | null = null;
  @Output() formSubmit = new EventEmitter<ToolFormDto>();

  form: FormGroup;
  statuses = Object.keys(ElementStatus);
  statusLabels: Record<string, string> = ElementStatus;

  constructor(public modalRef: BsModalRef, private fb: FormBuilder) {
    this.form = this.fb.group({
      name: [
        '',
        [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(50),
        ],
      ],
      status: [null, Validators.required],
      cost: [0, Validators.min(0)],
      quantity: [0, Validators.min(0)],
      type: [''],
      location: [''],
      link: [''],
      note: [''],
    });
  }

  ngOnInit(): void {
    if (this.tool) {
      this.form.patchValue(this.tool);
    }
  }

  onSubmit(): void {
    if (this.form.valid) {
      const tool: ToolFormDto = {
        name: this.form.value.name,
        status: this.form.value.status,
        cost: this.form.value.cost || 0,
        quantity: this.form.value.quantity || 0,
        location: this.form.value.location,
        link: this.form.value.link,
        note: this.form.value.note,
      };
      this.formSubmit.emit(tool);
    }
  }

  hideModal(): void {
    if (this.modalRef) {
      this.modalRef.hide();
    }
  }

  onCancel(): void {
    this.hideModal();
  }
}
