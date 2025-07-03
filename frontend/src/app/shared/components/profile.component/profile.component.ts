import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { UserService } from '../../../core/services/user.service';
import { User } from '../../../core/models/user.model';


@Component({
  selector: 'app-profile.component',
  standalone:true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent implements OnInit {
@ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;
  
  user: User | null = null;
  profileForm: FormGroup;
  isEditing = false;
  isSubmitting = false;
  showSuccessMessage = false;
  isUploading = false;
  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    private userService: UserService
  ) {
    this.profileForm = this.fb.group({
      firstName: ['', [Validators.required]],
      lastName: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      phone: [''],
      gender: [''],
      country: [''],
      paypalEmail: ['', [Validators.email]],
      avatarUrl: ['']
    });
  }

  ngOnInit() {
    this.loadUserData();
  }

  loadUserData() {
    this.userService.getUserProfile().subscribe({
      next: (userData) => {
        if (userData) {
          this.user = userData;
          this.profileForm.patchValue({
            firstName: userData.firstName,
            lastName: userData.lastName,
            email: userData.email,
            phone: userData.phone || '',
            gender: userData.gender || '',
            country: userData.country || '',
            paypalEmail: userData.paypalEmail || '',
            avatarUrl: userData.avatarUrl || ''
          });
        }
      },
      error: (error) => {
        console.error('Error loading user data:', error);
        this.errorMessage = 'Failed to load user profile. Please try again.';
      }
    });
  }

  toggleEditMode() {
    this.isEditing = !this.isEditing;
    this.errorMessage = '';
    if (!this.isEditing) {
      // Reset form to original values when canceling
      this.loadUserData();
    }
  }

  getInitials(): string {
    if (!this.user) return 'U';
    return (this.user.firstName.charAt(0) + this.user.lastName.charAt(0)).toUpperCase();
  }

  triggerFileInput() {
    this.fileInput.nativeElement.click();
  }

  onFileSelected(event: Event) {
    const target = event.target as HTMLInputElement;
    const file = target.files?.[0];
    
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        this.errorMessage = 'Please select a valid image file.';
        return;
      }
      
      // Validate file size (5MB max)
      if (file.size > 5 * 1024 * 1024) {
        this.errorMessage = 'Image size must be less than 5MB.';
        return;
      }

      this.uploadProfileImage(file);
    }
  }

  uploadProfileImage(file: File) {
    this.isUploading = true;
    this.errorMessage = '';

    this.userService.uploadProfileImage(file).subscribe({
      next: (response) => {
        this.isUploading = false;
        if (this.user) {
          this.user.avatarUrl = response.url;
          this.profileForm.patchValue({ avatarUrl: response.url });
        }
        this.showSuccessMessage = true;
        setTimeout(() => {
          this.showSuccessMessage = false;
        }, 3000);
      },
      error: (error) => {
        this.isUploading = false;
        console.error('Upload error:', error);
        this.errorMessage = 'Failed to upload image. Please try again.';
      }
    });
  }

  onSubmit() {
    if (this.profileForm.valid) {
      this.isSubmitting = true;
      this.errorMessage = '';
      
      const updateData = { ...this.profileForm.value };
      
      // Remove empty strings and convert to null for optional fields
      Object.keys(updateData).forEach(key => {
        if (updateData[key] === '') {
          updateData[key] = null;
        }
      });

      this.userService.updateUserProfile(updateData).subscribe({
        next: (updatedUser) => {
          this.user = updatedUser;
          this.isSubmitting = false;
          this.isEditing = false;
          this.showSuccessMessage = true;
          
          // Hide success message after 3 seconds
          setTimeout(() => {
            this.showSuccessMessage = false;
          }, 3000);
        },
        error: (error) => {
          this.isSubmitting = false;
          console.error('Update error:', error);
          this.errorMessage = 'Failed to update profile. Please try again.';
        }
      });
    }
  }
}

