import { HomeComponent } from './features/home/home.component';
import { LoginComponent } from './features/auth/pages/login/login.component';
import { NotFoundComponent } from './features/error/not-found/not-found.component';
import { RegisterComponent } from './features/auth/pages/register/register.component';
import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { noAuthGuard } from './core/guards/no-auth.guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  },
  {
    path: 'home',
    canActivate: [noAuthGuard],
    component: HomeComponent,
  },
  {
    path: 'login',
    canActivate: [noAuthGuard],
    component: LoginComponent,
  },
  {
    path: 'register',
    canActivate: [noAuthGuard],
    component: RegisterComponent,
  },
  {
    path: 'dashboard',
    canActivate: [authGuard],
    loadChildren: () =>
      import('./features/dashboard/dashboard.routes').then(
        (r) => r.DASHBOARD_ROUTES
      ),
  },
  { path: '**', component: NotFoundComponent },
];
