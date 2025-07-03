export interface Car {
    id: string;
    make: string;
    model: string;
    imageUrl: string;
    pricePerDay: number;
    category: string;
    transmission: string;
    fuelType: string;
    seats: number;
    isAvailable: boolean;
    description?: string;
    createdAt: string;
    updatedAt: string;
}
