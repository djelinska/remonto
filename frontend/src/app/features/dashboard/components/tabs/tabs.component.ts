import { RouterLink, RouterLinkActive } from '@angular/router';

import { Component } from '@angular/core';

@Component({
  selector: 'app-tabs',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './tabs.component.html',
  styleUrl: './tabs.component.scss',
})
export class TabsComponent {}
