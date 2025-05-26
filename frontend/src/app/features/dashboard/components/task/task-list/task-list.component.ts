import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CurrencyPipe, DatePipe } from '@angular/common';

import { PriorityBadgeDirective } from '../../../../../shared/directives/priority-badge.directive';
import { TaskCategory } from '../../../../../shared/enums/task-category';
import { TaskDto } from '../../../../../shared/models/task.dto';
import { TaskEditComponent } from '../task-edit/task-edit.component';
import { TaskPriority } from '../../../../../shared/enums/task-priority';
import { TaskStatus } from '../../../../../shared/enums/task-status';
import { TaskService } from '../../../../../core/services/task/task.service';
import { TaskFormDto } from '../../../../../core/services/task/models/task-form.dto';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-task-list',
  standalone: true,
  imports: [DatePipe, CurrencyPipe, PriorityBadgeDirective, FormsModule],
  templateUrl: './task-list.component.html',
  styleUrl: './task-list.component.scss',
})
export class TaskListComponent {
  @Input() tasks: TaskDto[] = [];
  @Input() projectId!: string;
  @Input() listId: string = ''; 
  @Output() taskDeleted = new EventEmitter<string>();
  @Output() taskUpdated = new EventEmitter<TaskDto>();

  categoryLabels: Record<string, string> = TaskCategory;
  statusLabels: Record<string, string> = TaskStatus;
  priorityLabels: Record<string, string> = TaskPriority;
  statusOptions = Object.keys(TaskStatus);

  constructor(private modalService: BsModalService, private taskService: TaskService) {}

  deleteTask(taskId: string): void {
    this.taskDeleted.emit(taskId);
  }

  openEditTaskModal(task: TaskDto): void {
    const initialState = {
      task,
      projectId: this.projectId,
    };
    const modalRef: BsModalRef = this.modalService.show(TaskEditComponent, {
      class: 'modal-md',
      initialState,
    });

    modalRef.content.taskUpdated.subscribe(() => {
      this.taskUpdated.emit();
    });
  }

  onStatusChange(task: TaskDto): void {
    const updatedTask: TaskFormDto = {
      name: task.name,
      category: task.category,
      status: task.status,
      startDate: task.startDate,
      endDate: task.endDate,
      allDay: task.allDay,
      priority: task.priority,
      cost: task.cost,
      note: task.note
    };

    this.taskService.updateTask(this.projectId, task.id, updatedTask).subscribe({
      next: () => {
        this.taskUpdated.emit();
      },
      error: (error) => {
        console.error('Error updating task status:', error);
      }
    });
  }
}