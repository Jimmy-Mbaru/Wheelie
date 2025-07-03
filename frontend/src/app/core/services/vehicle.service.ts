import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class VehicleService {
  constructor(private http: HttpClient) { }

  addVehicle(payload: any): Observable<any> {
    return this.http.post('/api/vehicles', payload);
  }

  getAllVehicles(): Observable<any[]> {
    return this.http.get<any[]>('/api/vehicles/filter');
  }

  getVehicleById(id: string): Observable<any> {
    return this.http.get<any>(`/api/vehicles/${id}`);
  }

  deleteVehicle(id: string): Observable<any> {
    return this.http.delete<any>(`/api/vehicles/${id}`);
  }

  getFilteredVehicles(filters: any): Observable<any[]> {
    let params = new URLSearchParams();
    if (filters.category) params.append('category', filters.category);
    if (filters.make) params.append('make', filters.make);
    if (filters.location) params.append('location', filters.location);
    if (filters.isAvailable) params.append('isAvailable', filters.isAvailable);
    
    return this.http.get<any[]>(`/api/vehicles/filter?${params.toString()}`);
  }
}