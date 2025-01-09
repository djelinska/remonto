import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { Component, OnInit } from '@angular/core';

import { ActivatedRoute } from '@angular/router';
import { Task } from '../../../../shared/models/task.model';
import { TaskAddComponent } from '../../components/task/task-add/task-add.component';
import { TaskListComponent } from '../../components/task/task-list/task-list.component';
import { TaskService } from '../../../../core/services/task/task.service';
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
  projectId: string | null = null;
  tasks: Task[] = [];
  todoTasks: Task[] = [];
  inProgressTasks: Task[] = [];
  completedTasks: Task[] = [];
  modalRef?: BsModalRef;

  constructor(
    private route: ActivatedRoute,
    private modalService: BsModalService,
    private taskService: TaskService
  ) {}

  ngOnInit(): void {
    this.route.parent?.paramMap.subscribe((params) => {
      this.projectId = params.get('id');
      this.loadTasks();
    });
  }

  private loadTasks(): void {
    if (this.projectId) {
      this.taskService.getTasksByProject(this.projectId).subscribe((tasks) => {
        this.tasks = tasks;
        this.filterTasksByStatus();
      });
    }
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

  openAddTaskModal(): void {
    const initialState = { projectId: this.projectId ?? undefined };
    const modalRef: BsModalRef = this.modalService.show(TaskAddComponent, {
      class: 'modal-md',
      backdrop: 'static',
      keyboard: false,
      initialState,
    });

    modalRef.content.taskAdded.subscribe(() => {
      this.loadTasks();
    });
  }

  deleteTask(taskId: string): void {
    if (this.projectId) {
      this.taskService.deleteTask(this.projectId, taskId).subscribe({
        next: () => {
          this.loadTasks();
        },
        error: (error) => {
          console.error('Error deleting task:', error);
        },
      });
    }
  }
}
