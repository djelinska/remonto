import { Component, EventEmitter, Output } from '@angular/core';

import { BsModalRef } from 'ngx-bootstrap/modal';
import { TemplateDto } from '../../../../../shared/models/template.dto';
import { TemplateFormComponent } from '../template-form/template-form.component';
import { TemplateFormDto } from '../../../../../core/services/template/models/template-form.dto';
import { TemplateService } from '../../../../../core/services/template/template.service';

@Component({
  selector: 'app-template-edit',
  standalone: true,
  imports: [TemplateFormComponent],
  templateUrl: './template-edit.component.html',
  styleUrl: './template-edit.component.scss',
})
export class TemplateEditComponent {
  @Output() templateUpdated = new EventEmitter<void>();

  template: TemplateDto | null = null;

  constructor(
    public modalRef: BsModalRef,
    private templateService: TemplateService
  ) {}

  onTemplateUpdated(template: TemplateFormDto): void {
    if (this.template) {
      this.templateService
        .updateTemplate(this.template.id, template)
        .subscribe({
          next: () => {
            this.templateUpdated.emit();
            this.hideModal();
          },
          error: (error) => {
            console.error('Error updating template:', error);
          },
        });
    }
  }

  hideModal(): void {
    if (this.modalRef) {
      this.modalRef.hide();
    }
  }

  onCancel(): void {
    this.hideModal();
  }
}
