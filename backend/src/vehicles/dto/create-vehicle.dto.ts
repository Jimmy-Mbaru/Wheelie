import {
  IsString,
  IsNumber,
  IsEnum,
  IsBoolean,
  IsOptional,
  IsUrl,
  IsInt,
  Min,
  Max,
} from 'class-validator';
import {
  VehicleCategory,
  FuelType,
  TransmissionType,
} from 'generated/prisma';
import { ApiProperty } from '@nestjs/swagger';

export class CreateVehicleDto {
  @ApiProperty({ example: 'Toyota' })
  @IsString()
  make: string;

  @ApiProperty({ example: 'Corolla' })
  @IsString()
  model: string;

  @ApiProperty({ example: 2022, minimum: 1900, maximum: 2030 })
  @IsInt()
  @Min(1900)
  @Max(2030)
  year: number;

  @ApiProperty({ enum: VehicleCategory, example: VehicleCategory.SEDAN })
  @IsEnum(VehicleCategory)
  category: VehicleCategory;

  @ApiProperty({ enum: FuelType, example: FuelType.PETROL })
  @IsEnum(FuelType)
  fuelType: FuelType;

  @ApiProperty({ enum: TransmissionType, example: TransmissionType.AUTOMATIC })
  @IsEnum(TransmissionType)
  transmission: TransmissionType;

  @ApiProperty({ example: 5, minimum: 1, maximum: 50 })
  @IsInt()
  @Min(1)
  @Max(50)
  seats: number;

  @ApiProperty({ example: 4000.00, minimum: 0 })
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  pricePerDay: number;

  @ApiProperty({ example: true, required: false, default: true })
  @IsBoolean()
  @IsOptional()
  isAvailable?: boolean;

  @ApiProperty({ 
    example: 'Comfortable, fuel-efficient vehicle perfect for city driving.', 
    required: false 
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ 
    example: 'https://example.com/vehicles/toyota-corolla.jpg', 
    required: false 
  })
  @IsUrl()
  @IsOptional()
  imageUrl?: string;

  @ApiProperty({ example: 'KDB 123A' })
  @IsString()
  licensePlate: string;

  @ApiProperty({ example: 95000, required: false, minimum: 0 })
  @IsInt()
  @Min(0)
  @IsOptional()
  mileage?: number;

  @ApiProperty({ example: 'Nairobi' })
  @IsString()
  location: string;
}