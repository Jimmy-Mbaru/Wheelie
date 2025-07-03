import { bootstrapApplication } from '@angular/platform-browser';
import { App } from './app/app';
import { appConfig } from './app/app.config';
import { AuthService } from './app/auth/auth.service';

bootstrapApplication(App, {
  providers: [...appConfig, AuthService]
})
  .catch((err) => console.error(err));
