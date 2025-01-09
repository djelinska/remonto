import { CanActivateFn, Router } from '@angular/router';

import { AuthService } from '../services/auth/auth.service';
import { inject } from '@angular/core';

export const noAuthGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (!authService.isAuthenticated()) {
    return true;
  } else {
    router.navigate(['/dashboard']);
    return false;
  }
};
