import { HttpInterceptorFn } from '@angular/common/http';

export const AuthInterceptor: HttpInterceptorFn = (req, next) => {
  const skipUrls = ['/api/auth/login', '/api/auth/register', 'cloudinary.com'];

  // Skip if the request URL matches any in skipUrls
  if (skipUrls.some(url => req.url.includes(url))) {
    return next(req);
  }

  const token = localStorage.getItem('token');
  console.log('Intercepted Token:', token); // For debugging

  if (token) {
    const cloned = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`,
      },
    });
    return next(cloned);
  }

  return next(req);
};
