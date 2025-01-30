import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { Component, OnInit } from '@angular/core';

import { ActivatedRoute } from '@angular/router';
import { DatePipe } from '@angular/common';
import { ProjectDto } from '../../../../../shared/models/project.dto';
import { ProjectEditComponent } from '../../project/project-edit/project-edit.component';
import { ProjectService } from '../../../../../core/services/project/project.service';

@Component({
  selector: 'app-info-general',
  standalone: true,
  imports: [DatePipe],
  templateUrl: './info-general.component.html',
  styleUrl: './info-general.component.scss',
})
export class InfoGeneralComponent implements OnInit {
  projectId!: string;
  project!: ProjectDto;

  constructor(
    private route: ActivatedRoute,
    private projectService: ProjectService,
    private modalService: BsModalService
  ) {}

  ngOnInit(): void {
    this.route.parent?.paramMap.subscribe((params) => {
      const projectId = params.get('id');
      if (projectId) {
        this.projectId = projectId;
        this.loadProjectInfo();
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

  openEditProjectModal(): void {
    const initialState = {
      project: this.project,
      projectId: this.projectId,
    };
    const modalRef: BsModalRef = this.modalService.show(ProjectEditComponent, {
      class: 'modal-md',
      backdrop: 'static',
      keyboard: false,
      initialState,
    });

    modalRef.content.projectUpdated.subscribe(() => {
      this.loadProjectInfo();
    });
  }
}
