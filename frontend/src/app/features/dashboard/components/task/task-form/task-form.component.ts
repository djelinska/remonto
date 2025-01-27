import { Component, EventEmitter, Input, Output } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

import { BsModalRef } from 'ngx-bootstrap/modal';
import { FormErrorComponent } from '../../../../../shared/components/form-error/form-error.component';
import { TaskCategory } from '../../../../../shared/enums/task-category';
import { TaskDto } from '../../../../../shared/models/task.dto';
import { TaskFormDto } from '../../../../../core/services/task/models/task-form.dto';
import { TaskPriority } from '../../../../../shared/enums/task-priority';
import { TaskStatus } from '../../../../../shared/enums/task-status';
import { formatDate } from '@angular/common';

@Component({
  selector: 'app-task-form',
  standalone: true,
  imports: [ReactiveFormsModule, FormErrorComponent],
  templateUrl: './task-form.component.html',
  styleUrl: './task-form.component.scss',
})
export class formComponent {
  @Input() task: TaskDto | null = null;
  @Output() formSubmit = new EventEmitter<TaskFormDto>();

  form: FormGroup;

  categories = Object.keys(TaskCategory);
  categoryLabels: Record<string, string> = TaskCategory;

  statuses = Object.keys(TaskStatus);
  statusLabels: Record<string, string> = TaskStatus;

  priorities = Object.keys(TaskPriority);
  priorityLabels: Record<string, string> = TaskPriority;

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
      category: [null, Validators.required],
      status: [null, Validators.required],
      startTime: [null],
      endTime: [null],
      priority: [null, Validators.required],
      cost: [0, Validators.min(0)],
      note: [''],
    });
  }

  ngOnInit(): void {
    if (this.task) {
      const formattedTask = { ...this.task };

      if (formattedTask.startTime) {
        formattedTask.startTime = formatDate(
          formattedTask.startTime,
          'yyyy-MM-ddTHH:mm',
          'pl'
        );
      }

      if (formattedTask.endTime) {
        formattedTask.endTime = formatDate(
          formattedTask.endTime,
          'yyyy-MM-ddTHH:mm',
          'pl'
        );
      }

      this.form.patchValue(formattedTask);
    }
  }

  onSubmit(): void {
    if (this.form.valid) {
      const task: TaskFormDto = {
        name: this.form.value.name,
        description: this.form.value.description,
        category: this.form.value.category,
        status: this.form.value.status,
        startTime: this.form.value.startTime,
        endTime: this.form.value.endTime,
        priority: this.form.value.priority,
        cost: this.form.value.cost || 0,
        note: this.form.value.note,
      };
      this.formSubmit.emit(task);
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
