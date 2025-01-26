import { Component, EventEmitter, Output } from '@angular/core';

import { BsModalRef } from 'ngx-bootstrap/modal';
import { MaterialDto } from '../../../../../shared/models/material.dto';
import { MaterialFormComponent } from '../material-form/material-form.component';
import { MaterialFormDto } from '../../../../../core/services/material/models/material-form.dto';
import { MaterialService } from '../../../../../core/services/material/material.service';

@Component({
  selector: 'app-material-edit',
  standalone: true,
  imports: [MaterialFormComponent],
  templateUrl: './material-edit.component.html',
  styleUrl: './material-edit.component.scss',
})
export class MaterialEditComponent {
  @Output() materialUpdated = new EventEmitter<void>();

  material: MaterialDto | null = null;
  projectId!: string;

  constructor(
    public modalRef: BsModalRef,
    private materialService: MaterialService
  ) {}

  onMaterialUpdated(material: MaterialFormDto): void {
    if (this.projectId && this.material) {
      this.materialService
        .updateMaterialInProject(this.projectId, this.material.id, material)
        .subscribe({
          next: () => {
            this.materialUpdated.emit();
            this.hideModal();
          },
          error: (error) => {
            console.error('Error updating material:', error);
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
