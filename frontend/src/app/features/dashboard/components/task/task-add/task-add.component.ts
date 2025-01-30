import { Component, EventEmitter, Output } from '@angular/core';

import { BsModalRef } from 'ngx-bootstrap/modal';
import { TaskFormComponent } from '../task-form/task-form.component';
import { TaskFormDto } from '../../../../../core/services/task/models/task-form.dto';
import { TaskService } from '../../../../../core/services/task/task.service';

@Component({
  selector: 'app-task-add',
  standalone: true,
  imports: [TaskFormComponent],
  templateUrl: './task-add.component.html',
  styleUrl: './task-add.component.scss',
})
export class TaskAddComponent {
  @Output() taskAdded = new EventEmitter<void>();

  projectId!: string;

  constructor(public modalRef: BsModalRef, private taskService: TaskService) {}

  onTaskAdded(task: TaskFormDto): void {
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
