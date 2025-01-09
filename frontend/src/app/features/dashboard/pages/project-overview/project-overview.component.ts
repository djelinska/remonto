import { Component } from '@angular/core';
import { HeaderComponent } from '../../components/shared/header/header.component';
import { RouterOutlet } from '@angular/router';
import { TabsComponent } from '../../components/shared/tabs/tabs.component';

@Component({
  selector: 'app-project-overview',
  standalone: true,
  imports: [RouterOutlet, HeaderComponent, TabsComponent],
  templateUrl: './project-overview.component.html',
  styleUrl: './project-overview.component.scss',
})
export class ProjectOverviewComponent {}
