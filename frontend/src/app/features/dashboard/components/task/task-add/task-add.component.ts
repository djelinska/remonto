import { Component, EventEmitter, Output } from '@angular/core';

import { BsModalRef } from 'ngx-bootstrap/modal';
import { TaskRequest } from '../../../../../core/services/task/models/task-request';
import { TaskService } from '../../../../../core/services/task/task.service';
import { formComponent } from '../task-form/task-form.component';

@Component({
  selector: 'app-task-add',
  standalone: true,
  imports: [formComponent],
  templateUrl: './task-add.component.html',
  styleUrl: './task-add.component.scss',
})
export class TaskAddComponent {
  @Output() taskAdded = new EventEmitter<void>();

  projectId?: string;

  constructor(public modalRef: BsModalRef, private taskService: TaskService) {}

  onTaskAdded(task: TaskRequest): void {
    if (this.projectId) {
      this.taskService.createTask(this.projectId, task).subscribe({
        next: () => {
          this.taskAdded.emit();
          this.hideModal();
        },
        error: (error) => {
          console.error('Error adding task:', error);
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
