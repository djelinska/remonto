import { ActivatedRoute, Router } from '@angular/router';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { Component, OnInit } from '@angular/core';
import { of, switchMap } from 'rxjs';

import { ConfirmModalComponent } from '../../../../../shared/components/confirm-modal/confirm-modal.component';
import { ProjectDto } from '../../../../../shared/models/project.dto';
import { ProjectService } from '../../../../../core/services/project/project.service';
import { ProjectStateService } from '../../../../../core/services/project/project-state.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [],
  providers: [ProjectService],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent implements OnInit {
  selectedProject: ProjectDto | null = null;
  modalRef?: BsModalRef;

  constructor(
    private projectService: ProjectService,
    private projectStateService: ProjectStateService,
    private modalService: BsModalService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.route.paramMap
      .pipe(
        switchMap((params) => {
          const projectId = params.get('id');
          return projectId
            ? this.projectService.getProjectById(projectId)
            : of(null);
        })
      )
      .subscribe({
        next: (project) => {
          this.selectedProject = project;
        },
        error: (error) => {
          console.error('Error fetching project:', error);
        },
      });
  }

  onDeleteProject(): void {
    this.modalRef = this.modalService.show(ConfirmModalComponent, {
      initialState: {
        title: 'Usuń projekt',
        message:
          'Czy na pewno chcesz usunąć ten projekt? Wszystkie dane zostaną trwale usunięte.',
        btnTitle: 'Usuń',
        confirmCallback: () => {
          this.deleteProject();
        },
      },
    });
  }

  deleteProject(): void {
    if (this.selectedProject?.id) {
      this.projectService.deleteProject(this.selectedProject.id).subscribe({
        next: () => {
          this.projectStateService.refreshProjects().subscribe();
          this.router.navigate(['/dashboard']);
        },
        error: (error) => {
          console.error('Error deleting project:', error);
        },
      });
    }
  }
}
