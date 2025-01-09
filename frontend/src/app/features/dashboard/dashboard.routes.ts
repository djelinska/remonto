import { CalendarComponent } from './pages/calendar/calendar.component';
import { DashboardComponent } from './dashboard.component';
import { InfoComponent } from './pages/info/info.component';
import { MaterialsToolsComponent } from './pages/materials-tools/materials-tools.component';
import { ProjectDetailsComponent } from './pages/project-details/project-details.component';
import { Routes } from '@angular/router';
import { TasksComponent } from './pages/tasks/tasks.component';
import { UserProfileComponent } from './pages/user-profile/user-profile.component';

export const DASHBOARD_ROUTES: Routes = [
  {
    path: '',
    component: DashboardComponent,
    children: [
      {
        path: 'profile',
        component: UserProfileComponent,
        pathMatch: 'full',
      },
      {
        path: 'projects/:id',
        component: ProjectDetailsComponent,
        children: [
          { path: 'calendar', component: CalendarComponent },
          { path: 'tasks', component: TasksComponent },
          { path: 'materials-tools', component: MaterialsToolsComponent },
          { path: 'info', component: InfoComponent },
          { path: '', redirectTo: 'calendar', pathMatch: 'full' },
        ],
      },
    ],
  },
];
