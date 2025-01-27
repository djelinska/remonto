import { Component, EventEmitter, Output } from '@angular/core';

import { BsModalRef } from 'ngx-bootstrap/modal';
import { ProjectDto } from '../../../../../shared/models/project.dto';
import { ProjectFormComponent } from '../project-form/project-form.component';
import { ProjectFormDto } from '../../../../../core/services/project/models/project-form.dto';
import { ProjectService } from '../../../../../core/services/project/project.service';

@Component({
  selector: 'app-project-edit',
  standalone: true,
  imports: [ProjectFormComponent],
  templateUrl: './project-edit.component.html',
  styleUrl: './project-edit.component.scss',
})
export class ProjectEditComponent {
  @Output() projectUpdated = new EventEmitter<void>();

  project: ProjectDto | null = null;
  projectId!: string;

  constructor(
    public modalRef: BsModalRef,
    private projectService: ProjectService
  ) {}

  onProjectUpdated(project: ProjectFormDto): void {
    if (this.projectId && this.project) {
      this.projectService.updateProject(this.projectId, project).subscribe({
        next: () => {
          this.projectUpdated.emit();
          this.hideModal();
        },
        error: (error) => {
          console.error('Error updating project:', error);
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
