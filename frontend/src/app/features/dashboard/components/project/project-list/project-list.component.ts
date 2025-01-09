import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { Component, OnInit } from '@angular/core';
import { Observable, map, switchMap } from 'rxjs';
import { RouterLink, RouterLinkActive } from '@angular/router';

import { CommonModule } from '@angular/common';
import { Project } from '../../../../../shared/models/project.model';
import { ProjectAddComponent } from '../project-add/project-add.component';
import { ProjectStateService } from '../../../../../core/services/project/project-state.service';

@Component({
  selector: 'app-project-list',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, CommonModule],
  templateUrl: './project-list.component.html',
  styleUrl: './project-list.component.scss',
})
export class ProjectListComponent implements OnInit {
  projects$!: Observable<Project[]>;
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
      backdrop: 'static',
      keyboard: false,
    });

    modalRef.content.projectAdded.subscribe(() => {
      this.projectStateService.refreshProjects().subscribe();
    });
  }
}
