import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BookingService } from '../../../core/services/bookings.service';

@Component({
    imports: [CommonModule],
    standalone: true,
    selector: 'app-bookings',
    templateUrl: './bookings.component.html',
})
export class BookingsComponent implements OnInit {
    currentBooking: any = null;
    bookingHistory: any[] = [];
    
    constructor(private bookingService: BookingService) { }
    
    ngOnInit() {
        this.bookingService.getMyBookings().subscribe((bookings: any[]) => {
            const now = new Date();
            
            // Sort bookings by creation date (newest first)
            const sorted = bookings.sort((a, b) => 
                new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
            );
            
            // Separate current and past bookings
            const [current, ...history] = sorted.reduce(
                (acc: [any, any[]], booking: any) => {
                    const end = new Date(booking.endDate);
                    if (!acc[0] && end >= now) {
                        acc[0] = booking;
                    } else {
                        acc[1].push(booking);
                    }
                    return acc;
                },
                [null, []] as [any, any[]]
            );
            
            this.currentBooking = current;
            this.bookingHistory = history;
        });
    }
    
    getVehicleName(vehicle: any): string {
        if (!vehicle) return 'Unknown Vehicle';
        return `${vehicle.make} ${vehicle.model} ${vehicle.year}`;
    }
    
    getStatusColor(status: string): string {
        switch (status) {
            case 'CONFIRMED': return 'text-green-600';
            case 'PENDING': return 'text-yellow-600';
            case 'CANCELLED': return 'text-red-600';
            case 'COMPLETED': return 'text-blue-600';
            default: return 'text-gray-600';
        }
    }
    
    formatCurrency(amount: number): string {
        return new Intl.NumberFormat('en-KE', {
            style: 'currency',
            currency: 'KES'
        }).format(amount);
    }
}