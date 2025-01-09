import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Material } from '../../../../shared/models/material.model';
import { Tool } from '../../../../shared/models/tool.model';
import { MaterialListComponent } from './material-list/material-list.component';
import { ToolListComponent } from './tool-list/tool-list.component';
import { MaterialService } from '../../../../core/services/material/material.service';
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
  projectId: string = '';
  tools: Tool[] = [];
  materials: Material[] = [];

  constructor(
    private route: ActivatedRoute,
    private materialService: MaterialService,
    private toolService: ToolService
  ) {}

  ngOnInit(): void {
    this.route.parent?.paramMap.subscribe((params) => {
      const projectId = params.get('id');
      console.log(projectId);
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
        console.log(materials);
      });
  }

  private loadTools(): void {
    this.toolService.getToolsByProject(this.projectId).subscribe((tools) => {
      this.tools = tools;
      console.log(tools);
    });
  }
}
