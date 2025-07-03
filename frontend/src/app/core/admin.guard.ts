import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const AdminGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const rawUser = localStorage.getItem('user');

  if (!rawUser) {
    router.navigate(['/auth/login']);
    return false;
  }

  try {
    const user = JSON.parse(rawUser);
    if (user?.role === 'ADMIN' || user?.role === 'SUPER_ADMIN') {
      return true;
    }
  } catch (err) {
    console.error('Failed to parse user from localStorage:', err);
  }

  router.navigate(['/auth/login']);
  return false;
};
