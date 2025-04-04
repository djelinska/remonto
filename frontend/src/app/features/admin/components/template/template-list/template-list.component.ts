import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { Component, EventEmitter, Input, Output } from '@angular/core';

import { RouterLink } from '@angular/router';
import { TemplateDto } from '../../../../../shared/models/template.dto';
import { TemplateEditComponent } from '../template-edit/template-edit.component';

@Component({
  selector: 'app-template-list',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './template-list.component.html',
  styleUrl: './template-list.component.scss',
})
export class TemplateListComponent {
  @Input() templates: TemplateDto[] = [];
  @Output() templateDeleted = new EventEmitter<string>();
  @Output() templateUpdated = new EventEmitter<TemplateDto>();

  constructor(private modalService: BsModalService) {}

  deleteTemplate(templateId: string): void {
    this.templateDeleted.emit(templateId);
  }

  openEditTemplateModal(template: TemplateDto): void {
    const initialState = {
      template,
    };
    const modalRef: BsModalRef = this.modalService.show(TemplateEditComponent, {
      class: 'modal-lg',
      initialState,
    });

    modalRef.content.templateUpdated.subscribe(() => {
      this.templateUpdated.emit();
    });
  }
}
