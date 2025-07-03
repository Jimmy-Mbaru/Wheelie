import { Routes } from '@angular/router';
import { RegisterComponent } from './register.component';
import { LoginComponent } from './login.component';

export const authRoutes: Routes = [

    { path: 'register', component: RegisterComponent },
    { path: 'login', component: LoginComponent }
];
