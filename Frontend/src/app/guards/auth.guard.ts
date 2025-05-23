import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { UserService } from '../../app/services/user.service';
export const authGuard: CanActivateFn = (route, state) => {
  const userService = inject(UserService);
  const router = inject(Router);

  if(localStorage.getItem('currentUser')) return true;
  else{
    router.navigateByUrl('/sign-in');
  }
  return false;
};
