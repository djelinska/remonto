import { RouterLink, RouterOutlet } from '@angular/router';

import { Component } from '@angular/core';
import { TopbarComponent } from './components/shared/topbar/topbar.component';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [RouterOutlet, TopbarComponent, RouterLink],
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.scss',
})
export class AdminComponent {}
