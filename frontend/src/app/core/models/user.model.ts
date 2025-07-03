export interface Car {
    id: string;
    make: string;
    model: string;
    year: number;
    pricePerDay: number;
    imageUrl: string;
    transmission: 'Manual' | 'Automatic';
    seats: number;
    fuelType: 'Petrol' | 'Diesel' | 'Hybrid' | 'Electric';
    category: string;
    isAvailable: boolean;
    rating: number;
    description?: string;
}

export interface User {
    id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone: string | null;
  avatarUrl: string | null;
  role: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  gender: string | null;
  country: string | null;
  paypalEmail: string | null;
}

export interface Rental {
    id: string;
    carId: string;
    userId: string;
    startDate: string;
    endDate: string;
    totalCost: number;
    status: string;
    car?: Car;
}
