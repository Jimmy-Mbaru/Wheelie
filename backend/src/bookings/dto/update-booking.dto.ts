import { PartialType } from '@nestjs/mapped-types';
import { CreateBookingDto } from './create-booking.dto';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateBookingDto extends PartialType(CreateBookingDto) {}
