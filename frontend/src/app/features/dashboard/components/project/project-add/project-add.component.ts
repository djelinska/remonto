import { Component, EventEmitter, Output } from '@angular/core';

import { BsModalRef } from 'ngx-bootstrap/modal';
import { Project } from '../../../../../shared/models/project.model';
import { ProjectFormComponent } from '../project-form/project-form.component';
import { ProjectRequest } from '../../../../../core/services/project/models/project-request';
import { ProjectService } from '../../../../../core/services/project/project.service';

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
    private projectService: ProjectService
  ) {}

  onProjectAdded(project: ProjectRequest): void {
    this.projectService.createProject(project).subscribe({
      next: () => {
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
