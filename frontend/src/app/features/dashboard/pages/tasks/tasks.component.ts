import { Component, OnInit } from '@angular/core';

import { ActivatedRoute } from '@angular/router';
import { Task } from '../../../../shared/models/task.model';
import { TaskListComponent } from './task-list/task-list.component';
import { TaskService } from '../../../../core/services/task.service';
import { TaskStatus } from '../../../../shared/enums/task-status';

@Component({
  selector: 'app-tasks',
  standalone: true,
  imports: [TaskListComponent],
  providers: [TaskService],
  templateUrl: './tasks.component.html',
  styleUrl: './tasks.component.scss',
})
export class TasksComponent implements OnInit {
  projectId: number = 0;
  tasks: Task[] = [];
  todoTasks: Task[] = [];
  inProgressTasks: Task[] = [];
  completedTasks: Task[] = [];

  constructor(
    private route: ActivatedRoute,
    private taskService: TaskService
  ) {}

  ngOnInit(): void {
    this.route.parent?.paramMap.subscribe((params) => {
      const projectId = params.get('id');
      if (projectId) {
        this.projectId = Number(projectId);
        this.loadTasks();
      }
    });
  }

  private loadTasks(): void {
    this.taskService.getTasksByProject(this.projectId).subscribe((tasks) => {
      this.tasks = tasks;
      this.filterTasksByStatus();
    });
  }

  private filterTasksByStatus(): void {
    this.todoTasks = this.tasks.filter(
      (task) => task.status === TaskStatus.NOT_STARTED
    );
    this.inProgressTasks = this.tasks.filter(
      (task) => task.status === TaskStatus.IN_PROGRESS
    );
    this.completedTasks = this.tasks.filter(
      (task) => task.status === TaskStatus.COMPLETED
    );
  }
}
