import { IsString, IsDateString, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateBookingDto {
  @ApiProperty({ example: 'clzvuv5le0001hdzy9znf9xlo' })
  @IsString()
  vehicleId: string;

  @ApiProperty({ example: '2025-07-01T10:00:00Z' })
  @IsDateString()
  startDate: Date;

  @ApiProperty({ example: '2025-07-03T10:00:00Z' })
  @IsDateString()
  endDate: Date;

  @ApiProperty({ example: 5000 })
  @IsNumber()
  totalAmount: number;
}