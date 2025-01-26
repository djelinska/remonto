import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { Component, EventEmitter, Input, Output } from '@angular/core';

import { TaskDto } from '../../../../../shared/models/task.dto';
import { TaskEditComponent } from '../task-edit/task-edit.component';

@Component({
  selector: 'app-task-list',
  standalone: true,
  imports: [],
  templateUrl: './task-list.component.html',
  styleUrl: './task-list.component.scss',
})
export class TaskListComponent {
  @Input() tasks: TaskDto[] = [];
  @Input() projectId!: string;
  @Output() taskDeleted = new EventEmitter<string>();
  @Output() taskUpdated = new EventEmitter<TaskDto>();

  constructor(private modalService: BsModalService) {}

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
      backdrop: 'static',
      keyboard: false,
      initialState,
    });

    modalRef.content.taskUpdated.subscribe(() => {
      this.taskUpdated.emit();
    });
  }
}
