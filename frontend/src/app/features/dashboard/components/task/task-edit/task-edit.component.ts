import { Component, EventEmitter, Output } from '@angular/core';

import { BsModalRef } from 'ngx-bootstrap/modal';
import { TaskDto } from '../../../../../shared/models/task.dto';
import { TaskFormComponent } from '../task-form/task-form.component';
import { TaskFormDto } from '../../../../../core/services/task/models/task-form.dto';
import { TaskService } from '../../../../../core/services/task/task.service';

@Component({
  selector: 'app-task-edit',
  standalone: true,
  imports: [TaskFormComponent],
  templateUrl: './task-edit.component.html',
  styleUrl: './task-edit.component.scss',
})
export class TaskEditComponent {
  @Output() taskUpdated = new EventEmitter<void>();

  task: TaskDto | null = null;
  projectId!: string;

  constructor(public modalRef: BsModalRef, private taskService: TaskService) {}

  onTaskUpdated(task: TaskFormDto): void {
    if (this.projectId && this.task) {
      this.taskService
        .updateTask(this.projectId, this.task.id, task)
        .subscribe({
          next: () => {
            this.taskUpdated.emit();
            this.hideModal();
          },
          error: (error) => {
            console.error('Error updating task:', error);
          },
        });
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
