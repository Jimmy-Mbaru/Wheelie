import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateVehicleDto } from './dto/create-vehicle.dto';
import { UpdateVehicleDto } from './dto/update-vehicle.dto';

@Injectable()
export class VehiclesService {
  constructor(private prisma: PrismaService) { }

  async create(createVehicleDto: CreateVehicleDto) {
    return this.prisma.vehicle.create({
      data: createVehicleDto,
    });
  }

  async findAll(filters: {
    category?: string;
    make?: string;
    location?: string;
    isAvailable?: string;
  }) {
    const { category, make, location, isAvailable } = filters;
    const now = new Date();

    const where: any = {
      ...(category && { category }),
      ...(make && { make: { contains: make, mode: 'insensitive' } }),
      ...(location && { location: { contains: location, mode: 'insensitive' } }),
    };

    if (isAvailable === 'true') {
      // Filter out vehicles with active bookings overlapping current time
      where.bookings = {
        none: {
          startDate: { lte: now },
          endDate: { gte: now },
        },
      };
    }

    return this.prisma.vehicle.findMany({
      where,
    });
  }

  async findOne(id: string) {
    const vehicle = await this.prisma.vehicle.findUnique({
      where: { id },
    });

    if (!vehicle) throw new NotFoundException('Vehicle not found');
    return vehicle;
  }


  async update(id: string, updateVehicleDto: UpdateVehicleDto) {
    await this.findOne(id); // ensures vehicle exists

    return this.prisma.vehicle.update({
      where: { id },
      data: {
        ...updateVehicleDto,
        imageUrl: updateVehicleDto.imageUrl,
      },
    });
  }

  async remove(id: string) {
    await this.findOne(id); // ensures vehicle exists

    return this.prisma.vehicle.delete({
      where: { id },
    });
  }
}
