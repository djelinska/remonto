import { Component, EventEmitter, Input, Output } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

import { BsModalRef } from 'ngx-bootstrap/modal';
import { FormErrorComponent } from '../../../../../shared/components/form-error/form-error.component';
import { ProjectDto } from '../../../../../shared/models/project.dto';
import { ProjectFormDto } from '../../../../../core/services/project/models/project-form.dto';

@Component({
  selector: 'app-project-form',
  standalone: true,
  imports: [ReactiveFormsModule, FormErrorComponent],
  templateUrl: './project-form.component.html',
  styleUrl: './project-form.component.scss',
})
export class ProjectFormComponent {
  @Input() project: ProjectDto | null = null;
  @Output() formSubmit = new EventEmitter<ProjectFormDto>();

  form: FormGroup;

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
      description: [''],
      startDate: ['', Validators.required],
      endDate: [''],
      budget: [0, [Validators.required, Validators.min(0)]],
    });
  }

  ngOnInit(): void {
    if (this.project) {
      this.form.patchValue(this.project);
    }
  }

  onSubmit(): void {
    if (this.form.valid) {
      const project: ProjectFormDto = {
        name: this.form.value.name,
        description: this.form.value.description,
        startDate: this.form.value.startDate,
        endDate: this.form.value.endDate,
        budget: this.form.value.budget,
      };
      this.formSubmit.emit(project);
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
