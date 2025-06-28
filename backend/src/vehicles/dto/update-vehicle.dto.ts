import { PartialType } from '@nestjs/mapped-types';
import { CreateVehicleDto } from './create-vehicle.dto';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateVehicleDto extends PartialType(CreateVehicleDto) {}
