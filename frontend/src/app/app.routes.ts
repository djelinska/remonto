import { HomeComponent } from './features/home/home.component';
import { LoginComponent } from './core/auth/pages/login/login.component';
import { NotFoundComponent } from './features/error/not-found/not-found.component';
import { RegisterComponent } from './core/auth/pages/register/register.component';
import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
    pathMatch: 'full',
  },
  {
    path: 'login',
    component: LoginComponent,
  },
  {
    path: 'register',
    component: RegisterComponent,
  },
  {
    path: 'dashboard',
    loadChildren: () =>
      import('./features/dashboard/dashboard.routes').then(
        (r) => r.DASHBOARD_ROUTES
      ),
  },
  { path: '**', component: NotFoundComponent },
];
