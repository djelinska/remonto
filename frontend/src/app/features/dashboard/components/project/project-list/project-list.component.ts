import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { Component, OnInit } from '@angular/core';
import { Observable, map } from 'rxjs';
import { RouterLink, RouterLinkActive } from '@angular/router';

import { CommonModule } from '@angular/common';
import { ProjectAddComponent } from '../project-add/project-add.component';
import { ProjectDto } from '../../../../../shared/models/project.dto';
import { ProjectStateService } from '../../../../../core/services/project/project-state.service';

@Component({
  selector: 'app-project-list',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, CommonModule],
  templateUrl: './project-list.component.html',
  styleUrl: './project-list.component.scss',
})
export class ProjectListComponent implements OnInit {
  projects$!: Observable<ProjectDto[]>;
  modalRef?: BsModalRef;

  constructor(
    private modalService: BsModalService,
    private projectStateService: ProjectStateService
  ) {}

  ngOnInit(): void {
    this.projects$ = this.projectStateService.projects$.pipe(
      map((projects) => projects || [])
    );

    this.projectStateService.loadProjects();
  }

  openAddProjectModal(): void {
    const modalRef: BsModalRef = this.modalService.show(ProjectAddComponent, {
      class: 'modal-md',
    });

    modalRef.content.projectAdded.subscribe(() => {
      this.projectStateService.refreshProjects().subscribe();
    });
  }
}
