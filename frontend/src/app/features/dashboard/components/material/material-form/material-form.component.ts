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
import { MaterialDto } from '../../../../../shared/models/material.dto';
import { MaterialFormDto } from '../../../../../core/services/material/models/material-form.dto';

@Component({
  selector: 'app-material-form',
  standalone: true,
  imports: [ReactiveFormsModule, FormErrorComponent],
  templateUrl: './material-form.component.html',
  styleUrl: './material-form.component.scss',
})
export class MaterialFormComponent {
  @Input() material: MaterialDto | null = null;
  @Output() formSubmit = new EventEmitter<MaterialFormDto>();

  form: FormGroup;
  statuses = Object.values(ElementStatus);

  constructor(public modalRef: BsModalRef, private fb: FormBuilder) {
    this.form = this.fb.group({
      name: ['', Validators.required],
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
    if (this.material) {
      this.form.patchValue(this.material);
    }
  }

  onSubmit(): void {
    if (this.form.valid) {
      const material: MaterialFormDto = {
        name: this.form.value.name,
        status: this.form.value.status,
        cost: this.form.value.cost,
        quantity: this.form.value.quantity,
        type: this.form.value.type,
        location: this.form.value.location,
        link: this.form.value.link,
        note: this.form.value.note,
      };
      this.formSubmit.emit(material);
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
