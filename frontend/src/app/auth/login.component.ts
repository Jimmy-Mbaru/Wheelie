import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from './auth.service';
import { HttpClientModule } from '@angular/common/http';

@Component({
  standalone: true,
  selector: 'app-login',
  imports: [CommonModule, FormsModule, RouterLink, HttpClientModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  email = '';
  password = '';
  error = '';
  loading = false;

  constructor(private authService: AuthService, private router: Router) { }

  async login() {
    this.error = '';
    this.loading = true;

    try {
      const response: any = await this.authService.login({
        email: this.email,
        password: this.password
      }).toPromise(); 
      
      console.log('Login response:', response);

      localStorage.setItem('token', response.access_token);
      localStorage.setItem('user', JSON.stringify(response.user));

      const role = response.user.role;

      if (role === 'ADMIN' || role === 'SUPER_ADMIN') {
        this.router.navigate(['/dashboard/admin']);
      } else {
        this.router.navigate(['/dashboard/user']);
      }

    } catch (err: any) {
      this.error = err.error?.message || 'Login failed';
      console.error('Login error:', err); 
    } finally {
      this.loading = false;
    }
  }
}