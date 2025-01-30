import { Component, OnInit } from '@angular/core';

import { ActivatedRoute } from '@angular/router';
import { InfoBudgetComponent } from '../../components/info/info-budget/info-budget.component';
import { InfoGeneralComponent } from '../../components/info/info-general/info-general.component';
import { InfoImagesComponent } from '../../components/info/info-images/info-images.component';
import { ProjectBudgetDto } from '../../../../core/services/project/models/project-budget.dto';
import { ProjectDto } from '../../../../shared/models/project.dto';
import { ProjectService } from '../../../../core/services/project/project.service';

@Component({
  selector: 'app-info',
  standalone: true,
  imports: [InfoGeneralComponent, InfoBudgetComponent, InfoImagesComponent],
  templateUrl: './info.component.html',
  styleUrl: './info.component.scss',
})
export class InfoComponent implements OnInit {
  projectId!: string;
  project!: ProjectDto;
  projectBudget!: ProjectBudgetDto;

  constructor(
    private route: ActivatedRoute,
    private projectService: ProjectService
  ) {}

  ngOnInit(): void {
    this.route.parent?.paramMap.subscribe((params) => {
      const projectId = params.get('id');
      if (projectId) {
        this.projectId = projectId;
        this.loadProjectInfo();
        this.loadProjectBudget();
      }
    });
  }

  private loadProjectInfo(): void {
    if (this.projectId) {
      this.projectService
        .getProjectById(this.projectId)
        .subscribe((project) => {
          this.project = project;
        });
    }
  }

  private loadProjectBudget(): void {
    if (this.projectId) {
      this.projectService
        .getProjectBudget(this.projectId)
        .subscribe((budget) => {
          this.projectBudget = budget;
        });
    }
  }

  refreshProject(): void {
    this.loadProjectInfo();
    this.loadProjectBudget();
  }
}
