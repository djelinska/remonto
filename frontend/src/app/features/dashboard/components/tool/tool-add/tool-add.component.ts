import { Component, EventEmitter, Output } from '@angular/core';

import { BsModalRef } from 'ngx-bootstrap/modal';
import { ToolFormComponent } from '../tool-form/tool-form.component';
import { ToolFormDto } from '../../../../../core/services/tool/models/tool-form.dto';
import { ToolService } from '../../../../../core/services/tool/tool.service';

@Component({
  selector: 'app-tool-add',
  standalone: true,
  imports: [ToolFormComponent],
  templateUrl: './tool-add.component.html',
  styleUrl: './tool-add.component.scss',
})
export class ToolAddComponent {
  @Output() toolAdded = new EventEmitter<void>();

  projectId!: string;

  constructor(public modalRef: BsModalRef, private toolService: ToolService) {}

  onToolAdded(tool: ToolFormDto): void {
    if (this.projectId) {
      this.toolService.addToolToProject(this.projectId, tool).subscribe({
        next: () => {
          this.toolAdded.emit();
          this.hideModal();
        },
        error: (error) => {
          console.error('Error adding tool:', error);
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
