import { ForbiddenComponent } from './features/error/forbidden/forbidden.component';
import { HomeComponent } from './features/home/home.component';
import { LoginComponent } from './features/auth/pages/login/login.component';
import { NotFoundComponent } from './features/error/not-found/not-found.component';
import { RegisterComponent } from './features/auth/pages/register/register.component';
import { Routes } from '@angular/router';
import { UserType } from './shared/enums/user-type';
import { authGuard } from './core/guards/auth.guard';
import { noAuthGuard } from './core/guards/no-auth.guard';
import { userTypeGuard } from './core/guards/user-type.guard';

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
    canActivate: [authGuard, userTypeGuard],
    data: { userTypes: [UserType.USER] },
    loadChildren: () =>
      import('./features/dashboard/dashboard.routes').then(
        (r) => r.DASHBOARD_ROUTES
      ),
  },
  {
    path: 'admin',
    canActivate: [authGuard, userTypeGuard],
    data: { userTypes: [UserType.ADMIN] },
    loadChildren: () =>
      import('./features/admin/admin.routes').then((r) => r.ADMIN_ROUTES),
  },
  {
    path: 'forbidden',
    component: ForbiddenComponent,
  },
  { path: '**', component: NotFoundComponent },
];
