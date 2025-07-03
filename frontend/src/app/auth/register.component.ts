import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from './auth.service';

@Component({
  standalone: true,
  selector: 'app-register',
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  firstName = '';
  lastName = '';
  email = '';
  password = '';
  confirmPassword = '';
  error = '';
  loading = false;

  constructor(private authService: AuthService, private router: Router) { }

  async register() {
    this.error = '';
    this.loading = true;

    if (this.password !== this.confirmPassword) {
      this.error = 'Passwords do not match';
      this.loading = false;
      return;
    }

    try {
      const response: any = await this.authService.register({
        firstName: this.firstName,
        lastName: this.lastName,
        email: this.email,
        password: this.password
      }).toPromise();

      console.log('Register response:', response);

      localStorage.setItem('token', response.access_token);
      localStorage.setItem('user', JSON.stringify(response.user));

      const role = response.user?.role;

      if (!role) {
        this.error = 'Unexpected error. Please try again.';
        return;
      }

      if (role === 'ADMIN' || role === 'SUPER_ADMIN') {
        this.router.navigate(['/dashboard/admin']);
      } else {
        this.router.navigate(['/dashboard/user']);
      }

    } catch (err: any) {
      this.error = err.error?.message || 'Registration failed';
      console.error('Register error:', err);
    } finally {
      this.loading = false;
    }
  }
}
