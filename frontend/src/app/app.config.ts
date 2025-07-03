import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { AuthInterceptor } from './core/auth.interceptor';

export const appConfig = [
  provideRouter(routes),
  provideHttpClient(withInterceptors([AuthInterceptor]))
];
