import { Component, OnInit } from '@angular/core';

import { ActivatedRoute } from '@angular/router';
import { Project } from '../../../../shared/models/project.model';
import { ProjectService } from '../../../../core/services/project/project.service';
import { switchMap } from 'rxjs';

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
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.route.paramMap
      .pipe(
        switchMap((params) => {
          const id = params.get('id');
          if (id != null) {
            const projectId = Number(id);
            return this.projectService.getProjectById(projectId);
          } else {
            return [];
          }
        })
      )
      .subscribe((project) => {
        this.selectedProject = project;
      });
  }
}
