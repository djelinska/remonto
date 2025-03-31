import { Component, EventEmitter, Input, Output } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

import { FormErrorComponent } from '../../../../../shared/components/form-error/form-error.component';
import { TaskCategory } from '../../../../../shared/enums/task-category';
import { TaskPriority } from '../../../../../shared/enums/task-priority';

@Component({
  selector: 'app-task-form',
  standalone: true,
  imports: [FormErrorComponent, ReactiveFormsModule],
  templateUrl: './task-form.component.html',
  styleUrl: './task-form.component.scss',
})
export class TaskFormComponent {
  @Input() taskForm!: FormGroup;
  @Input() taskIndex!: number;
  @Output() removeTask = new EventEmitter<void>();

  categories = Object.keys(TaskCategory);
  categoryLabels: Record<string, string> = TaskCategory;

  priorities = Object.keys(TaskPriority);
  priorityLabels: Record<string, string> = TaskPriority;

  static createTaskForm(): FormGroup {
    return new FormBuilder().group({
      name: [
        '',
        [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(50),
        ],
      ],
      category: [null, Validators.required],
      priority: ['LOW', Validators.required],
      note: [''],
    });
  }

  onRemoveTask() {
    this.removeTask.emit();
  }
}
