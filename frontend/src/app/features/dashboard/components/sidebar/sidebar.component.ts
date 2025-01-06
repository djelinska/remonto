import { Component, OnInit } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

import { Project } from '../../../../shared/models/project.model';
import { ProjectService } from '../../../../core/services/project.service';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  providers: [ProjectService],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss',
})
export class SidebarComponent implements OnInit {
  projects: Project[] = [];
  selectedProjectName: string | null = null;

  constructor(private projectService: ProjectService) {}

  ngOnInit(): void {
    this.projectService.getProjects().subscribe({
      next: (res) => {
        this.projects = res;
      },
    });
  }
}
