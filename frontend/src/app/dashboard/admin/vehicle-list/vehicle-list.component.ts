import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { VehicleService } from '../../../core/services/vehicle.service';

interface Vehicle {
  id: string;
  make: string;
  model: string;
  year: number;
  category: string;
  location: string;
  pricePerDay: number;
  isAvailable: boolean;
  imageUrl?: string;
}

@Component({
  selector: 'app-vehicle-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './vehicle-list.component.html',
  styleUrls: ['./vehicle-list.component.css']
})
export class VehicleListComponent implements OnInit {
  vehicles: Vehicle[] = [];
  isLoading = false;

  selectedCategory = '';
  selectedMake = '';
  selectedLocation = '';
  selectedAvailability = '';

  constructor(
    private router: Router,
    private vehicleService: VehicleService
  ) {}

  ngOnInit(): void {
    this.loadVehicles();
  }

  loadVehicles(): void {
    this.isLoading = true;

    this.vehicleService.getAllVehicles().subscribe({
      next: (vehicles) => {
        this.vehicles = vehicles;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading vehicles:', error);
        this.isLoading = false;
      }
    });
  }

  onFilterChange(): void {
    // Filtering logic will be added later
    this.loadVehicles();
  }

  clearFilters(): void {
    this.selectedCategory = '';
    this.selectedMake = '';
    this.selectedLocation = '';
    this.selectedAvailability = '';
    this.loadVehicles();
  }

  navigateToAddVehicle(): void {
    this.router.navigate(['/dashboard/admin/add-vehicle']);
  }

  editVehicle(vehicleId: string): void {
    this.router.navigate(['/dashboard/admin/edit-vehicle', vehicleId]);
  }

  deleteVehicle(vehicleId: string): void {
    if (confirm('Are you sure you want to delete this vehicle?')) {
      this.loadVehicles();
    }
  }

  onImageError(event: any): void {
    event.target.src = '/assets/images/default-car.jpg';
  }
}
