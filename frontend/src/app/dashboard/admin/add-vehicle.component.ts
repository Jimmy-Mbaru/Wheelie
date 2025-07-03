import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { VehicleService } from '../../core/services/vehicle.service';
import { CloudinaryService } from '../../core/services/cloudinary.service';

@Component({
  selector: 'app-add-vehicle',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './add-vehicle.component.html',
})
export class AddVehicleComponent {
  form: FormGroup;
  uploading = false;
  previewUrl: string | null = null;

  constructor(
    private fb: FormBuilder,
    private vehicleService: VehicleService,
    private cloudinaryService: CloudinaryService,
    private router: Router
  ) {
    this.form = this.fb.group({
      make: ['', Validators.required],
      model: ['', Validators.required],
      year: ['', [Validators.required, Validators.min(1900), Validators.max(2030)]],
      category: ['', Validators.required],
      fuelType: ['', Validators.required], 
      transmission: ['', Validators.required], 
      seats: ['', [Validators.required, Validators.min(1), Validators.max(50)]],
      licensePlate: ['', Validators.required], 
      mileage: ['', [Validators.min(0)]], 
      description: [''], 
      location: ['', Validators.required],
      pricePerDay: ['', Validators.required],
      isAvailable: [true],
      image: [null, Validators.required],
    });
  }

  onFileChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];

    if (file) {
      this.form.patchValue({ image: file });

      const reader = new FileReader();
      reader.onload = () => {
        this.previewUrl = reader.result as string;
      };
      reader.readAsDataURL(file);
    }
  }

  async submitForm(): Promise<void> {
    if (this.form.invalid) return;

    this.uploading = true;

    try {
      const imageFile: File = this.form.get('image')!.value;

      const cloudinaryResponse = await this.cloudinaryService
        .uploadImage(imageFile)
        .toPromise();

      const payload = {
        make: this.form.get('make')!.value,
        model: this.form.get('model')!.value,
        year: this.form.get('year')!.value,
        category: this.form.get('category')!.value,
        fuelType: this.form.get('fuelType')!.value, 
        transmission: this.form.get('transmission')!.value, 
        seats: this.form.get('seats')!.value, 
        licensePlate: this.form.get('licensePlate')!.value, 
        mileage: this.form.get('mileage')!.value || undefined, 
        description: this.form.get('description')!.value || undefined, 
        location: this.form.get('location')!.value,
        pricePerDay: this.form.get('pricePerDay')!.value,
        isAvailable: this.form.get('isAvailable')!.value,
        imageUrl: cloudinaryResponse.secure_url, 
      };

      await this.vehicleService.addVehicle(payload).toPromise();

      alert('Vehicle added successfully!');
      this.router.navigate(['/admin/home']);
    } catch (err: any) {
      console.error('Error:', err);

      if (err.status === 0) {
        alert('Network error - Please check your internet connection');
      } else if (err.error?.message) {
        alert(`Error: ${err.error.message}`);
      } else {
        alert('Something went wrong. Please try again.');
      }
    } finally {
      this.uploading = false;
    }
  }
}