import { IsInt, IsNotEmpty, IsOptional, Max, Min } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateReviewDto {
  @ApiProperty({ example: 4, minimum: 1, maximum: 5 })
  @IsInt()
  @Min(1)
  @Max(5)
  rating: number;

  @ApiPropertyOptional({ example: 'The car was comfortable and clean.' })
  @IsOptional()
  comment?: string;

  @ApiProperty({ example: 'vehicle-id-123' })
  @IsNotEmpty()
  vehicleId: string;
}
