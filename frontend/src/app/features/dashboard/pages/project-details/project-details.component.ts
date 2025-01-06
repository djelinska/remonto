import { Component } from '@angular/core';
import { HeaderComponent } from '../../components/header/header.component';
import { RouterOutlet } from '@angular/router';
import { TabsComponent } from '../../components/tabs/tabs.component';

@Component({
  selector: 'app-project-details',
  standalone: true,
  imports: [HeaderComponent, TabsComponent, RouterOutlet],
  templateUrl: './project-details.component.html',
  styleUrl: './project-details.component.scss',
})
export class ProjectDetailsComponent {}
