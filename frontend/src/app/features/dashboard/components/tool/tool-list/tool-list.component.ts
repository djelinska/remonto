import { Component, Input } from '@angular/core';
import { Tool } from '../../../../../shared/models/tool.model';

@Component({
  selector: 'app-tool-list',
  standalone: true,
  imports: [],
  templateUrl: './tool-list.component.html',
  styleUrl: './tool-list.component.scss',
})
export class ToolListComponent {
  @Input() tools: Tool[] = [];
}
