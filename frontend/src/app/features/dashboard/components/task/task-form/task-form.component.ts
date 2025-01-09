import { Component, EventEmitter, Input, Output } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

import { BsModalRef } from 'ngx-bootstrap/modal';
import { FormErrorComponent } from '../../../../../shared/components/form-error/form-error.component';
import { Task } from '../../../../../shared/models/task.model';
import { TaskCategory } from '../../../../../shared/enums/task-category';
import { TaskPriority } from '../../../../../shared/enums/task-priority';
import { TaskRequest } from '../../../../../core/services/task/models/task-request';
import { TaskStatus } from '../../../../../shared/enums/task-status';

@Component({
  selector: 'app-task-form',
  standalone: true,
  imports: [ReactiveFormsModule, FormErrorComponent],
  templateUrl: './task-form.component.html',
  styleUrl: './task-form.component.scss',
})
export class formComponent {
  @Input() task: Task | null = null;
  @Output() formSubmit = new EventEmitter<TaskRequest>();

  form: FormGroup;
  categories = Object.values(TaskCategory);
  priorities = Object.values(TaskPriority);
  statuses = Object.values(TaskStatus);

  constructor(public modalRef: BsModalRef, private fb: FormBuilder) {
    this.form = this.fb.group({
      name: ['', Validators.required],
      description: [''],
      category: [null, Validators.required],
      status: [null, Validators.required],
      startTime: [''],
      endTime: [''],
      priority: [null, Validators.required],
      cost: [0, [Validators.min(0)]],
      note: [''],
    });
  }

  ngOnInit(): void {
    if (this.task) {
      this.form.patchValue(this.task);
    }
  }

  onSubmit(): void {
    if (this.form.valid) {
      this.formSubmit.emit(this.form.value);
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
