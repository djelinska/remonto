import { CanActivateFn, Router } from '@angular/router';

import { AuthService } from '../services/auth/auth.service';
import { UserType } from '../../shared/enums/user-type';
import { inject } from '@angular/core';

export const noAuthGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const user = authService.getLoggedInUser();

  if (!user) {
    return true;
  }

  if (user?.type === UserType.ADMIN) {
    router.navigate(['/admin']);
  } else if (user?.type === UserType.USER) {
    router.navigate(['/dashboard']);
  } else {
    router.navigate(['/']);
  }

  return false;
};
