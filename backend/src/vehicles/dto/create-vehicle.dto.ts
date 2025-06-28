import {
  IsString,
  IsNumber,
  IsEnum,
  IsBoolean,
  IsOptional,
  IsUrl,
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

  @ApiProperty({ example: 2022 })
  @IsNumber()
  year: number;

  @ApiProperty({ enum: VehicleCategory })
  @IsEnum(VehicleCategory)
  category: VehicleCategory;

  @ApiProperty({ enum: FuelType })
  @IsEnum(FuelType)
  fuelType: FuelType;

  @ApiProperty({ enum: TransmissionType })
  @IsEnum(TransmissionType)
  transmission: TransmissionType;

  @ApiProperty({ example: 5 })
  @IsNumber()
  seats: number;

  @ApiProperty({ example: 4000 })
  @IsNumber()
  pricePerDay: number;

  @ApiProperty({ example: true, required: false })
  @IsBoolean()
  @IsOptional()
  isAvailable?: boolean;

  @ApiProperty({ example: 'Comfortable, fuel-efficient vehicle.', required: false })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ example: 'https://example.com/car.jpg', required: false })
  @IsUrl()
  @IsOptional()
  imageUrl?: string;

  @ApiProperty({ example: 'KDB 123A' })
  @IsString()
  licensePlate: string;

  @ApiProperty({ example: 90000, required: false })
  @IsNumber()
  @IsOptional()
  mileage?: number;

  @ApiProperty({ example: 'Nairobi' })
  @IsString()
  location: string;
}
