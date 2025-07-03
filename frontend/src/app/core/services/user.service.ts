import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, catchError, of } from 'rxjs';
import { Car, Rental, User } from '../models/user.model';

@Injectable({
    providedIn: 'root'
})
export class UserService {
    private baseUrl = 'http://localhost:3000/api';

    constructor(private http: HttpClient) { }

    private getHttpHeaders(): HttpHeaders {
        const token = localStorage.getItem('access_token');
        return new HttpHeaders({
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
        });
    }

    getUserProfile(): Observable<User | null> {
        return this.http.get<User>(`${this.baseUrl}/users/profile`, {
            headers: this.getHttpHeaders()
        }).pipe(
            catchError(error => {
                console.error('User profile error:', error);
                return of(null);
            })
        );
    }

    getAvailableCars(): Observable<Car[]> {
        const url = `${this.baseUrl}/vehicles/filter?isAvailable=true`;
        return this.http.get<Car[]>(url, {
            headers: this.getHttpHeaders()
        }).pipe(
            catchError(error => {
                console.error('Cars fetch error:', error);
                return of([]);
            })
        );
    }

    getCarById(id: string): Observable<Car | null> {
        const url = `${this.baseUrl}/vehicles/${id}`;
        return this.http.get<Car>(url, {
            headers: this.getHttpHeaders()
        }).pipe(
            catchError(error => {
                console.error('Error fetching car by ID:', error);
                return of(null);
            })
        );
    }

    createBooking(payload: {
        vehicleId: string;
        startDate: string;
        endDate: string;
        totalAmount: number;
    }): Observable<any> {
        return this.http.post(`${this.baseUrl}/bookings`, payload, {
            headers: this.getHttpHeaders()
        }).pipe(
            catchError(error => {
                console.error('Booking error:', error);
                throw error;
            })
        );
    }


    getUserRentals(): Observable<Rental[]> {
        return this.http.get<Rental[]>(`${this.baseUrl}/users/me/rentals`, {
            headers: this.getHttpHeaders()
        }).pipe(
            catchError(error => {
                console.error('Rentals fetch error:', error);
                return of([]);
            })
        );
    }

    updateUserProfile(updateData: Partial<User>): Observable<User> {
        return this.http.patch<User>(`${this.baseUrl}/users/profile`, updateData, {
            headers: this.getHttpHeaders()
        }).pipe(
            catchError(error => {
                console.error('Update profile error:', error);
                throw error;
            })
        );
    }

    uploadProfileImage(file: File): Observable<{ message: string; url: string }> {
        const formData = new FormData();
        formData.append('file', file);

        const token = localStorage.getItem('access_token');
        const headers = new HttpHeaders({
            Authorization: `Bearer ${token}`
        });

        return this.http.post<{ message: string; url: string }>(
            `${this.baseUrl}/users/upload-profile`,
            formData,
            { headers }
        ).pipe(
            catchError(error => {
                console.error('Upload image error:', error);
                throw error;
            })
        );
    }
}
