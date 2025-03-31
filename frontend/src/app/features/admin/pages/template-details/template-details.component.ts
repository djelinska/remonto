import { ActivatedRoute, Router } from '@angular/router';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';

import { ConfirmModalComponent } from '../../../../shared/components/confirm-modal/confirm-modal.component';
import { CurrencyPipe } from '@angular/common';
import { MaterialUnit } from '../../../../shared/enums/material-unit';
import { PriorityBadgeDirective } from '../../../../shared/directives/priority-badge.directive';
import { TaskCategory } from '../../../../shared/enums/task-category';
import { TemplateDto } from '../../../../shared/models/template.dto';
import { TemplateEditComponent } from '../../components/template/template-edit/template-edit.component';
import { TemplateService } from '../../../../core/services/template/template.service';

@Component({
  selector: 'app-template-details',
  standalone: true,
  imports: [CurrencyPipe, PriorityBadgeDirective],
  templateUrl: './template-details.component.html',
  styleUrl: './template-details.component.scss',
})
export class TemplateDetailsComponent implements OnInit {
  templateId!: string;
  template!: TemplateDto;
  modalRef!: BsModalRef;

  categoryLabels: Record<string, string> = TaskCategory;
  units = Object.keys(MaterialUnit);
  unitLabels: Record<string, string> = MaterialUnit;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private templateService: TemplateService,
    private modalService: BsModalService
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      const templateId = params.get('id');
      if (templateId) {
        this.templateId = templateId;
        this.loadTemplate();
      }
    });
  }

  private loadTemplate(): void {
    if (this.templateId) {
      this.templateService
        .getTemplateById(this.templateId)
        .subscribe((template: TemplateDto) => {
          this.template = template;
        });
    }
  }

  openEditTemplateModal(template: TemplateDto): void {
    const initialState = {
      template,
    };
    const modalRef: BsModalRef = this.modalService.show(TemplateEditComponent, {
      class: 'modal-lg',
      backdrop: 'static',
      keyboard: false,
      initialState,
    });

    modalRef.content.templateUpdated.subscribe(() => {
      this.loadTemplate();
    });
  }

  onDeleteTemplate(): void {
    this.modalRef = this.modalService.show(ConfirmModalComponent, {
      initialState: {
        title: 'Usuń szablon',
        message:
          'Czy na pewno chcesz usunąć ten szablon? Wszystkie dane zostaną trwale usunięte.',
        btnTitle: 'Usuń',
        confirmCallback: () => {
          this.deleteTemplate();
        },
      },
    });
  }

  deleteTemplate(): void {
    this.templateService.deleteTemplate(this.templateId).subscribe({
      next: () => {
        this.router.navigate(['admin/templates']);
      },
      error: (error) => {
        console.error('Error deleting template:', error);
      },
    });
  }
}
