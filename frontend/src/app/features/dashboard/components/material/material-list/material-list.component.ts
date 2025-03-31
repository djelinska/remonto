import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CurrencyPipe, DatePipe } from '@angular/common';

import { ElementStatus } from '../../../../../shared/enums/element-status';
import { MaterialDto } from '../../../../../shared/models/material.dto';
import { MaterialEditComponent } from '../material-edit/material-edit.component';
import { MaterialUnit } from '../../../../../shared/enums/material-unit';

@Component({
  selector: 'app-material-list',
  standalone: true,
  imports: [CurrencyPipe, DatePipe],
  templateUrl: './material-list.component.html',
  styleUrl: './material-list.component.scss',
})
export class MaterialListComponent {
  @Input() materials: MaterialDto[] = [];
  @Input() projectId!: string;
  @Output() materialDeleted = new EventEmitter<string>();
  @Output() materialUpdated = new EventEmitter<MaterialDto>();

  statusLabels: Record<string, string> = ElementStatus;
  units = Object.keys(MaterialUnit);
  unitLabels: Record<string, string> = MaterialUnit;

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
