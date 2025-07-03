import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class AuthService {
  constructor(private http: HttpClient) {}

  register(data: { firstName: string; lastName: string; email: string; password: string }) {
    return this.http.post('/api/auth/register', data);
  }

  login(data: { email: string; password: string }) {
    return this.http.post<{ access_token: string; user: any }>('/api/auth/login', data).pipe(
      tap((response) => {
        localStorage.setItem('token', response.access_token);
        localStorage.setItem('user', JSON.stringify(response.user));
      })
    );
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }
}
