import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { UserService } from '../../../core/services/user.service';
import { Car } from '../../../core/models/user.model';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-car-details',
    standalone: true,
    templateUrl: './car-details.component.html',
    styleUrls: ['./car-details.component.css'],
    imports: [CommonModule, RouterModule] 
})
export class CarDetailsComponent implements OnInit {
    car: Car | null = null;
    isLoading = true;
    error: string | null = null;

    constructor(
        private route: ActivatedRoute,
        private userService: UserService,
        private router: Router
    ) { }

    ngOnInit(): void {
        const carId = this.route.snapshot.paramMap.get('id');
        if (carId) {
            this.userService.getCarById(carId).subscribe({
                next: (car) => {
                    this.car = car;
                    this.isLoading = false;
                    if (!this.car) this.error = 'Car not found.';
                },
                error: (err) => {
                    console.error(err);
                    this.error = 'Failed to load car details.';
                    this.isLoading = false;
                }
            });
        } else {
            this.error = 'Invalid car ID.';
            this.isLoading = false;
        }
    }

    bookNow(): void {
        if (!this.car) return;

        const today = new Date();
        const tomorrow = new Date();
        tomorrow.setDate(today.getDate() + 1);

        const bookingPayload = {
            vehicleId: this.car.id,
            startDate: today.toISOString(),
            endDate: tomorrow.toISOString(),
            totalAmount: this.car.pricePerDay
        };

        this.userService.createBooking(bookingPayload).subscribe({
            next: () => {
                alert('Car booked successfully!');
                this.router.navigate(['/dashboard/user']);
            },
            error: (err) => {
                console.error(err);
                alert('Booking failed. Try again later.');
            }
        });
    }
}
