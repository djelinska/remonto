import { Component, Input } from '@angular/core';
import { Material } from '../../../../../shared/models/material.model';

@Component({
  selector: 'app-material-list',
  standalone: true,
  imports: [],
  templateUrl: './material-list.component.html',
  styleUrl: './material-list.component.scss',
})
export class MaterialListComponent {
  @Input() materials: Material[] = [];
}
