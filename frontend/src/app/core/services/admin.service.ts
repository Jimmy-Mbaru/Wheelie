import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AdminService {
  private readonly http = inject(HttpClient);

  getDashboardStats(): Observable<DashboardStats> {
    return this.http.get<DashboardStats>('/api/admin/dashboard');
  }

  getRecentBookings(): Observable<any[]> {
    return this.http.get<any[]>('/api/bookings');
  }
}

interface DashboardStats {
  totalRevenue: number;
  totalBookings: number;
  activeVehicles: number;
  totalUsers: number;
  topVehicles: TopVehicle[];
}

interface TopVehicle {
  id: string;
  make: string;
  model: string;
  year: number;
  imageUrl: string | null;
  bookings: number;
}
