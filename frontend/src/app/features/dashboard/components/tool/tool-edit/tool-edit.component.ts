import { Component, EventEmitter, Output } from '@angular/core';

import { BsModalRef } from 'ngx-bootstrap/modal';
import { ToolDto } from '../../../../../shared/models/tool.dto';
import { ToolFormComponent } from '../tool-form/tool-form.component';
import { ToolFormDto } from '../../../../../core/services/tool/models/tool-form.dto';
import { ToolService } from '../../../../../core/services/tool/tool.service';

@Component({
  selector: 'app-tool-edit',
  standalone: true,
  imports: [ToolFormComponent],
  templateUrl: './tool-edit.component.html',
  styleUrl: './tool-edit.component.scss',
})
export class ToolEditComponent {
  @Output() toolUpdated = new EventEmitter<void>();

  tool: ToolDto | null = null;
  projectId!: string;

  constructor(public modalRef: BsModalRef, private toolService: ToolService) {}

  onToolUpdated(tool: ToolFormDto): void {
    if (this.projectId && this.tool) {
      this.toolService
        .updateToolInProject(this.projectId, this.tool.id, tool)
        .subscribe({
          next: () => {
            this.toolUpdated.emit();
            this.hideModal();
          },
          error: (error) => {
            console.error('Error updating tool:', error);
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
