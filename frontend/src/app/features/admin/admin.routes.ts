import { AdminComponent } from './admin.component';
import { Routes } from '@angular/router';
import { TemplateDetailsComponent } from './pages/template-details/template-details.component';
import { TemplatesComponent } from './pages/templates/templates.component';

export const ADMIN_ROUTES: Routes = [
  {
    path: '',
    component: AdminComponent,
    children: [
      {
        path: 'templates',
        component: TemplatesComponent,
      },
      {
        path: 'templates/:id',
        component: TemplateDetailsComponent,
      },
    ],
  },
];
