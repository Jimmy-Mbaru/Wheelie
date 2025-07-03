import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";

@Injectable({ providedIn: 'root' })
export class BookingService {
  private readonly apiUrl = '/api/bookings';

  constructor(private http: HttpClient) {}

  getMyBookings() {
    return this.http.get<any[]>(`${this.apiUrl}/my`);
  }
}
