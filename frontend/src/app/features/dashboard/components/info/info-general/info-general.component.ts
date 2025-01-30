import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CurrencyPipe, DatePipe } from '@angular/common';

import { ProjectDto } from '../../../../../shared/models/project.dto';
import { ProjectEditComponent } from '../../project/project-edit/project-edit.component';
import { ProjectService } from '../../../../../core/services/project/project.service';

@Component({
  selector: 'app-info-general',
  standalone: true,
  imports: [DatePipe, CurrencyPipe],
  templateUrl: './info-general.component.html',
  styleUrl: './info-general.component.scss',
})
export class InfoGeneralComponent {
  @Input() project!: ProjectDto;
  @Output() projectUpdated = new EventEmitter<void>();

  constructor(private modalService: BsModalService) {}

  openEditProjectModal(): void {
    const initialState = {
      project: this.project,
      projectId: this.project.id,
    };
    const modalRef: BsModalRef = this.modalService.show(ProjectEditComponent, {
      class: 'modal-md',
      backdrop: 'static',
      keyboard: false,
      initialState,
    });

    modalRef.content.projectUpdated.subscribe(() => {
      this.projectUpdated.emit();
    });
  }
}
