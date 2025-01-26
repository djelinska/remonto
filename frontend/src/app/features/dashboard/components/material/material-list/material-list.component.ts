import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { Component, EventEmitter, Input, Output } from '@angular/core';

import { MaterialDto } from '../../../../../shared/models/material.dto';
import { MaterialEditComponent } from '../material-edit/material-edit.component';

@Component({
  selector: 'app-material-list',
  standalone: true,
  imports: [],
  templateUrl: './material-list.component.html',
  styleUrl: './material-list.component.scss',
})
export class MaterialListComponent {
  @Input() materials: MaterialDto[] = [];
  @Input() projectId!: string;
  @Output() materialDeleted = new EventEmitter<string>();
  @Output() materialUpdated = new EventEmitter<MaterialDto>();

  constructor(private modalService: BsModalService) {}

  deleteMaterial(materialId: string): void {
    this.materialDeleted.emit(materialId);
  }

  openEditMaterialModal(material: MaterialDto): void {
    const initialState = {
      material,
      projectId: this.projectId,
    };
    const modalRef: BsModalRef = this.modalService.show(MaterialEditComponent, {
      class: 'modal-md',
      backdrop: 'static',
      keyboard: false,
      initialState,
    });

    modalRef.content.materialUpdated.subscribe(() => {
      this.materialUpdated.emit();
    });
  }
}
