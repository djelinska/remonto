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
export class TaskFormComponent {
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
      category: [null, Validators.required],
      status: [null, Validators.required],
      startDate: [null],
      endDate: [null],
      allDay: [false],
      priority: ['LOW', Validators.required],
      cost: [0, Validators.min(0)],
      note: [''],
    });
  }

  ngOnInit(): void {
    if (this.task) {
      const formattedTask = { ...this.task };

      const formatTaskDate = (
        date: string | undefined,
        isAllDay: boolean
      ): string | undefined => {
        if (!date) {
          return undefined;
        }
        return formatDate(
          date,
          isAllDay ? 'yyyy-MM-dd' : 'yyyy-MM-ddTHH:mm',
          'pl'
        );
      };

      formattedTask.startDate = formatTaskDate(
        formattedTask.startDate,
        !!formattedTask.allDay
      );
      formattedTask.endDate = formatTaskDate(
        formattedTask.endDate,
        !!formattedTask.allDay
      );

      this.form.patchValue(formattedTask);
    }

    this.form.get('allDay')?.valueChanges.subscribe((value) => {
      const startDateControl = this.form.get('startDate');
      const endDateControl = this.form.get('endDate');

      if (value) {
        startDateControl?.setValidators(Validators.required);
      } else {
        startDateControl?.removeValidators(Validators.required);
      }

      startDateControl?.setValue(null);
      startDateControl?.updateValueAndValidity();

      endDateControl?.setValue(null);
      endDateControl?.updateValueAndValidity();
    });
  }

  onSubmit(): void {
    if (this.form.valid) {
      const task: TaskFormDto = {
        name: this.form.value.name,
        category: this.form.value.category,
        status: this.form.value.status,
        startDate: this.form.value.startDate,
        endDate: this.form.value.endDate,
        allDay: this.form.value.allDay,
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
