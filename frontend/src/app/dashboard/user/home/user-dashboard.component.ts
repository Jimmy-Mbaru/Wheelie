import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router'; // ✅ Import this
import { UserService } from '../../../core/services/user.service';
import { Car, Rental, User } from '../../../core/models/user.model';

@Component({
  selector: 'app-user-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule], // ✅ Add RouterModule here
  templateUrl: './user-dashboard.component.html',
  styleUrls: ['./user-dashboard.component.css']
})
export class UserDashboardComponent implements OnInit {
  user: User | null = null;
  cars: Car[] = [];
  filteredCars: Car[] = [];
  userRentals: Rental[] = [];

  selectedCategory: string = '';
  selectedTransmission: string = '';
  selectedFuelType: string = '';
  maxPrice: number | null = null;

  isLoadingUser: boolean = false;
  isLoadingCars: boolean = false;
  isLoadingRentals: boolean = false;

  userError: string | null = null;
  carsError: string | null = null;
  rentalsError: string | null = null;

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.loadUserProfile();
    this.loadAvailableCars();
    this.loadUserRentals();
  }

  loadUserProfile(): void {
    this.isLoadingUser = true;
    this.userError = null;

    this.userService.getUserProfile().subscribe(user => {
      this.isLoadingUser = false;
      if (user) this.user = user;
      else this.userError = 'Failed to load user profile';
    });
  }

  loadAvailableCars(): void {
    this.isLoadingCars = true;
    this.carsError = null;

    this.userService.getAvailableCars().subscribe(cars => {
      this.isLoadingCars = false;
      this.cars = cars;
      this.filteredCars = [...this.cars];
    });
  }

  loadUserRentals(): void {
    this.isLoadingRentals = true;
    this.rentalsError = null;

    this.userService.getUserRentals().subscribe(rentals => {
      this.isLoadingRentals = false;
      this.userRentals = rentals;
    });
  }

  updateUserProfile(updateData: Partial<User>): void {
    this.userService.updateUserProfile(updateData).subscribe({
      next: (updatedUser) => {
        this.user = updatedUser;
      },
      error: (error) => {
        console.error('Error updating profile:', error);
        alert('Failed to update profile');
      }
    });
  }

  uploadProfileImage(file: File): void {
    this.userService.uploadProfileImage(file).subscribe({
      next: (response) => {
        console.log('Profile image uploaded:', response);
        if (this.user) this.user.avatarUrl = response.url;
      },
      error: (error) => {
        console.error('Error uploading profile image:', error);
        alert('Failed to upload profile image');
      }
    });
  }

  filterCars(): void {
    this.filteredCars = this.cars.filter(car => {
      const categoryMatch = !this.selectedCategory || car.category === this.selectedCategory;
      const transmissionMatch = !this.selectedTransmission || car.transmission === this.selectedTransmission;
      const fuelTypeMatch = !this.selectedFuelType || car.fuelType === this.selectedFuelType;
      const priceMatch = !this.maxPrice || car.pricePerDay <= this.maxPrice;

      return categoryMatch && transmissionMatch && fuelTypeMatch && priceMatch;
    });
  }

  selectCar(car: Car): void {
    if (car.isAvailable) {
      console.log('Selected car:', car);
      alert(`You selected ${car.make} ${car.model} - $${car.pricePerDay}/day`);
    }
  }

  resetFilters(): void {
    this.selectedCategory = '';
    this.selectedTransmission = '';
    this.selectedFuelType = '';
    this.maxPrice = null;
    this.filterCars();
  }

  refreshData(): void {
    this.loadUserProfile();
    this.loadAvailableCars();
    this.loadUserRentals();
  }

  onProfileImageUpload(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];
      this.uploadProfileImage(file);
    }
  }

  logout(): void {
    localStorage.removeItem('access_token');
    this.user = null;
    this.cars = [];
    this.filteredCars = [];
    this.userRentals = [];
  }

  getFuelTypeBadgeClasses(fuelType: string): string {
    switch (fuelType) {
      case 'Petrol': return 'bg-red-100 text-red-800';
      case 'Diesel': return 'bg-gray-100 text-gray-800';
      case 'Hybrid': return 'bg-green-100 text-green-800';
      case 'Electric': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  }
}
