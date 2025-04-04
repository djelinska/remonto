import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { Component, OnInit } from '@angular/core';

import { ConfirmModalComponent } from '../../../../shared/components/confirm-modal/confirm-modal.component';
import { TemplateAddComponent } from '../../components/template/template-add/template-add.component';
import { TemplateDto } from '../../../../shared/models/template.dto';
import { TemplateListComponent } from '../../components/template/template-list/template-list.component';
import { TemplateService } from '../../../../core/services/template/template.service';

@Component({
  selector: 'app-templates',
  standalone: true,
  imports: [TemplateListComponent],
  templateUrl: './templates.component.html',
  styleUrl: './templates.component.scss',
})
export class TemplatesComponent implements OnInit {
  templates: TemplateDto[] = [];
  modalRef!: BsModalRef;

  constructor(
    private modalService: BsModalService,
    private templateService: TemplateService
  ) {}

  ngOnInit(): void {
    this.loadTemplates();
  }

  openAddMaterialModal(): void {
    const modalRef: BsModalRef = this.modalService.show(TemplateAddComponent, {
      class: 'modal-lg',
    });

    modalRef.content.templateAdded.subscribe(() => {
      this.loadTemplates();
    });
  }

  onDeleteTemplate(templateId: string): void {
    this.modalRef = this.modalService.show(ConfirmModalComponent, {
      initialState: {
        title: 'Usuń szablon',
        message:
          'Czy na pewno chcesz usunąć ten szablon? Wszystkie dane zostaną trwale usunięte.',
        btnTitle: 'Usuń',
        confirmCallback: () => {
          this.deleteTemplate(templateId);
        },
      },
    });
  }

  deleteTemplate(templateId: string): void {
    this.templateService.deleteTemplate(templateId).subscribe({
      next: () => {
        this.loadTemplates();
      },
      error: (error) => {
        console.error('Error deleting template:', error);
      },
    });
  }

  private loadTemplates(): void {
    this.templateService.getAllTemplates().subscribe((templates) => {
      this.templates = templates;
    });
  }

  refreshTemplates(): void {
    this.loadTemplates();
  }
}
