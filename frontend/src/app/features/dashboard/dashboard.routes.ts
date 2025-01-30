import { CalendarComponent } from './pages/calendar/calendar.component';
import { DashboardComponent } from './dashboard.component';
import { GlobalSearchComponent } from './pages/global-search/global-search.component';
import { InfoComponent } from './pages/info/info.component';
import { MaterialsToolsComponent } from './pages/materials-tools/materials-tools.component';
import { ProjectOverviewComponent } from './pages/project-overview/project-overview.component';
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
      },
      {
        path: 'search',
        component: GlobalSearchComponent,
      },
      {
        path: 'projects/:id',
        component: ProjectOverviewComponent,
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
