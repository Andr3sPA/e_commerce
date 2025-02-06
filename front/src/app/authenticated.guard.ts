import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { AuthService } from './auth.service';

export const authenticatedGuard: CanActivateFn = (route, state) => {
  return inject(AuthService).getStatus() === "authenticated"
};
