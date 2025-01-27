import { Component, EventEmitter, Output } from '@angular/core';

import { BsModalRef } from 'ngx-bootstrap/modal';
import { MaterialFormComponent } from '../material-form/material-form.component';
import { MaterialFormDto } from '../../../../../core/services/material/models/material-form.dto';
import { MaterialService } from '../../../../../core/services/material/material.service';

@Component({
  selector: 'app-material-add',
  standalone: true,
  imports: [MaterialFormComponent],
  templateUrl: './material-add.component.html',
  styleUrl: './material-add.component.scss',
})
export class MaterialAddComponent {
  @Output() materialAdded = new EventEmitter<void>();

  projectId!: string;

  constructor(
    public modalRef: BsModalRef,
    private materialService: MaterialService
  ) {}

  onMaterialAdded(material: MaterialFormDto): void {
    if (this.projectId) {
      this.materialService
        .addMaterialToProject(this.projectId, material)
        .subscribe({
          next: () => {
            this.materialAdded.emit();
            this.hideModal();
          },
          error: (error) => {
            console.error('Error adding material:', error);
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
