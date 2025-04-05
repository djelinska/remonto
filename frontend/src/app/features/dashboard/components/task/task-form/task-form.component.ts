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
import { dateRangeValidator } from '../../../../../shared/validators/date-range.validator';
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
    this.form = this.fb.group(
      {
        name: [
          '',
          [
            Validators.required,
            Validators.minLength(3),
            Validators.maxLength(50),
          ],
        ],
        category: [null, Validators.required],
        status: ['NOT_STARTED', Validators.required],
        startDate: [''],
        endDate: [''],
        allDay: [false],
        priority: ['LOW', Validators.required],
        cost: [0, Validators.min(0)],
        note: [''],
      },
      { validators: dateRangeValidator }
    );
  }

  ngOnInit(): void {
    this.loadTaskData();
    this.handleAllDayToggle();
    this.handleStartDateChange();
    this.handleEndDateChange();
  }

  private formatDateForInput(
    dateStr: string | undefined,
    isAllDay: boolean
  ): string | undefined {
    if (!dateStr) {
      return undefined;
    }
    return formatDate(
      dateStr,
      isAllDay ? 'yyyy-MM-dd' : 'yyyy-MM-ddTHH:mm',
      'pl'
    );
  }

  private loadTaskData(): void {
    if (!this.task) return;

    const formatted = { ...this.task };

    formatted.startDate = this.formatDateForInput(
      formatted.startDate,
      !!formatted.allDay
    );
    formatted.endDate = this.formatDateForInput(
      formatted.endDate,
      !!formatted.allDay
    );

    this.form.patchValue(formatted);
  }

  private handleAllDayToggle(): void {
    this.form.get('allDay')?.valueChanges.subscribe((allDay: boolean) => {
      const start = this.form.get('startDate');
      const end = this.form.get('endDate');

      allDay
        ? start?.setValidators([Validators.required])
        : start?.removeValidators(Validators.required);

      start?.setValue('');
      end?.setValue('');

      start?.updateValueAndValidity({ emitEvent: false });
      end?.updateValueAndValidity({ emitEvent: false });
    });
  }

  private handleStartDateChange(): void {
    this.form.get('startDate')?.valueChanges.subscribe(() => {
      const start = this.form.get('startDate');
      const end = this.form.get('endDate');
      const allDay = this.form.get('allDay');

      if (!start || !end) return;

      if (allDay?.value && !start.hasValidator(Validators.required)) {
        start.setValidators([Validators.required]);
        start.updateValueAndValidity({ emitEvent: false });
      }

      const startDate = start.value ? new Date(start.value) : '';
      const endDate = end.value ? new Date(end.value) : '';

      if (!startDate) return;

      const startFormatted = this.formatDateForInput(
        startDate.toISOString(),
        allDay?.value
      );
      const endFormatted = endDate
        ? this.formatDateForInput(endDate.toISOString(), allDay?.value)
        : null;

      if (allDay?.value) {
        if (!end?.value || end.value === start.value) {
          end.setValue(start.value, {
            emitEvent: false,
          });
        }
      } else {
        const oneHourLater = new Date(startDate);
        oneHourLater.setHours(oneHourLater.getHours() + 1);

        if (!endDate || startFormatted === endFormatted) {
          end.setValue(
            this.formatDateForInput(oneHourLater.toISOString(), false),
            {
              emitEvent: false,
            }
          );
        }
      }

      end.markAsTouched();
      end.markAsDirty();
      end.updateValueAndValidity({ emitEvent: false });
    });
  }

  private handleEndDateChange(): void {
    this.form.get('endDate')?.valueChanges.subscribe(() => {
      const end = this.form.get('endDate');
      end?.markAsTouched();
      end?.markAsDirty();
      end?.updateValueAndValidity({ emitEvent: false });
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
    this.form.markAllAsTouched();
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
