import { Component, EventEmitter, Input, Output } from '@angular/core';

import { Task } from '../../../../../shared/models/task.model';

@Component({
  selector: 'app-task-list',
  standalone: true,
  imports: [],
  templateUrl: './task-list.component.html',
  styleUrl: './task-list.component.scss',
})
export class TaskListComponent {
  @Input() tasks: Task[] = [];
  @Output() taskDeleted = new EventEmitter<string>();

  deleteTask(taskId: string): void {
    this.taskDeleted.emit(taskId);
  }
}
