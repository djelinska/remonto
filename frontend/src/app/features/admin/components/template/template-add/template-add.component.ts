import { Component, EventEmitter, Output } from '@angular/core';

import { BsModalRef } from 'ngx-bootstrap/modal';
import { TemplateFormComponent } from '../template-form/template-form.component';
import { TemplateFormDto } from '../../../../../core/services/template/models/template-form.dto';
import { TemplateService } from '../../../../../core/services/template/template.service';

@Component({
  selector: 'app-template-add',
  standalone: true,
  imports: [TemplateFormComponent],
  templateUrl: './template-add.component.html',
  styleUrl: './template-add.component.scss',
})
export class TemplateAddComponent {
  @Output() templateAdded = new EventEmitter<void>();

  constructor(
    public modalRef: BsModalRef,
    private templateService: TemplateService
  ) {}

  onTemplateAdded(template: TemplateFormDto): void {
    this.templateService.createTemplate(template).subscribe({
      next: () => {
        this.templateAdded.emit();
        this.hideModal();
      },
      error: (error) => {
        console.error('Error adding template:', error);
      },
    });
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
