import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';

import { ActivatedRoute } from '@angular/router';
import { Component } from '@angular/core';
import { MaterialAddComponent } from '../../components/material/material-add/material-add.component';
import { MaterialDto } from '../../../../shared/models/material.dto';
import { MaterialListComponent } from '../../components/material/material-list/material-list.component';
import { MaterialService } from '../../../../core/services/material/material.service';
import { ToolAddComponent } from '../../components/tool/tool-add/tool-add.component';
import { ToolDto } from '../../../../shared/models/tool.dto';
import { ToolListComponent } from '../../components/tool/tool-list/tool-list.component';
import { ToolService } from '../../../../core/services/tool/tool.service';

@Component({
  selector: 'app-materials-tools',
  standalone: true,
  imports: [MaterialListComponent, ToolListComponent],
  providers: [MaterialService],
  templateUrl: './materials-tools.component.html',
  styleUrl: './materials-tools.component.scss',
})
export class MaterialsToolsComponent {
  projectId!: string;
  tools: ToolDto[] = [];
  materials: MaterialDto[] = [];

  constructor(
    private route: ActivatedRoute,
    private materialService: MaterialService,
    private toolService: ToolService,
    private modalService: BsModalService
  ) {}

  ngOnInit(): void {
    this.route.parent?.paramMap.subscribe((params) => {
      const projectId = params.get('id');
      if (projectId) {
        this.projectId = projectId;
        this.loadMaterials();
        this.loadTools();
      }
    });
  }

  private loadMaterials(): void {
    this.materialService
      .getMaterialsByProject(this.projectId)
      .subscribe((materials) => {
        this.materials = materials;
      });
  }

  private loadTools(): void {
    this.toolService.getToolsByProject(this.projectId).subscribe((tools) => {
      this.tools = tools;
    });
  }

  openAddMaterialModal(): void {
    const initialState = { projectId: this.projectId };
    const modalRef: BsModalRef = this.modalService.show(MaterialAddComponent, {
      class: 'modal-md',
      backdrop: 'static',
      keyboard: false,
      initialState,
    });

    modalRef.content.materialAdded.subscribe(() => {
      this.loadMaterials();
    });
  }

  openAddToolModal(): void {
    const initialState = { projectId: this.projectId };
    const modalRef: BsModalRef = this.modalService.show(ToolAddComponent, {
      class: 'modal-md',
      backdrop: 'static',
      keyboard: false,
      initialState,
    });

    modalRef.content.toolAdded.subscribe(() => {
      this.loadTools();
    });
  }

  deleteMaterial(materialId: string): void {
    if (this.projectId) {
      this.materialService
        .deleteMaterialFromProject(this.projectId, materialId)
        .subscribe({
          next: () => {
            this.loadMaterials();
          },
          error: (error) => {
            console.error('Error deleting material:', error);
          },
        });
    }
  }

  deleteTool(toolId: string): void {
    if (this.projectId) {
      this.toolService.deleteToolFromProject(this.projectId, toolId).subscribe({
        next: () => {
          this.loadTools();
        },
        error: (error) => {
          console.error('Error deleting tool:', error);
        },
      });
    }
  }

  refreshMaterials(): void {
    this.loadMaterials();
  }

  refreshTools(): void {
    this.loadTools();
  }
}
