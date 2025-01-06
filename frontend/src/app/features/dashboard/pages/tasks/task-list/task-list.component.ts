import { Component, Input } from '@angular/core';

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
}
