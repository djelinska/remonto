import { Component, EventEmitter, Output } from '@angular/core';

import { BsModalRef } from 'ngx-bootstrap/modal';
import { MaterialFormDto } from '../../../../../core/services/material/models/material-form.dto';
import { MaterialService } from '../../../../../core/services/material/material.service';
import { ProjectFormComponent } from '../project-form/project-form.component';
import { ProjectFormDto } from '../../../../../core/services/project/models/project-form.dto';
import { ProjectService } from '../../../../../core/services/project/project.service';
import { TaskFormDto } from '../../../../../core/services/task/models/task-form.dto';
import { TaskService } from '../../../../../core/services/task/task.service';
import { ToolFormDto } from '../../../../../core/services/tool/models/tool-form.dto';
import { ToolService } from '../../../../../core/services/tool/tool.service';

@Component({
  selector: 'app-project-add',
  standalone: true,
  imports: [ProjectFormComponent],
  templateUrl: './project-add.component.html',
  styleUrl: './project-add.component.scss',
})
export class ProjectAddComponent {
  @Output() projectAdded = new EventEmitter<void>();

  constructor(
    public modalRef: BsModalRef,
    private projectService: ProjectService,
    private taskService: TaskService,
    private materialService: MaterialService,
    private toolService: ToolService
  ) {}

  onProjectAdded(project: ProjectFormDto): void {
    this.projectService.createProject(project).subscribe({
      next: (createdProject) => {
        if (project.template) {
          const projectId = createdProject.id;

          const tasks = project.tasks;
          tasks?.forEach((task: TaskFormDto) => {
            this.taskService.createTask(projectId, task).subscribe();
          });

          const materials = project.materials;
          materials?.forEach((material: MaterialFormDto) => {
            this.materialService
              .addMaterialToProject(projectId, material)
              .subscribe();
          });

          const tools = project.tools;
          tools?.forEach((tool: ToolFormDto) => {
            this.toolService.addToolToProject(projectId, tool).subscribe();
          });
        }

        this.projectAdded.emit();
        this.hideModal();
      },
      error: (error) => {
        console.error('Error adding project:', error);
      },
    });
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
