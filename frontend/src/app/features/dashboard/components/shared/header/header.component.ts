import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { of, switchMap } from 'rxjs';

import { Project } from '../../../../../shared/models/project.model';
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
  selectedProject: Project | null = null;

  constructor(
    private projectService: ProjectService,
    private projectStateService: ProjectStateService,
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
