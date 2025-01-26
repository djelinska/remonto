import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { Component, EventEmitter, Input, Output } from '@angular/core';

import { ToolDto } from '../../../../../shared/models/tool.dto';
import { ToolEditComponent } from '../tool-edit/tool-edit.component';

@Component({
  selector: 'app-tool-list',
  standalone: true,
  imports: [],
  templateUrl: './tool-list.component.html',
  styleUrl: './tool-list.component.scss',
})
export class ToolListComponent {
  @Input() tools: ToolDto[] = [];
  @Input() projectId!: string;
  @Output() toolDeleted = new EventEmitter<string>();
  @Output() toolUpdated = new EventEmitter<ToolDto>();

  constructor(private modalService: BsModalService) {}

  deleteTool(toolId: string): void {
    this.toolDeleted.emit(toolId);
  }

  openEditToolModal(tool: ToolDto): void {
    const initialState = {
      tool,
      projectId: this.projectId,
    };
    const modalRef: BsModalRef = this.modalService.show(ToolEditComponent, {
      class: 'modal-md',
      backdrop: 'static',
      keyboard: false,
      initialState,
    });

    modalRef.content.toolUpdated.subscribe(() => {
      this.toolUpdated.emit();
    });
  }
}
