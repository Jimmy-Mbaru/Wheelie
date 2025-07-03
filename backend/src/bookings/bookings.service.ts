import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateBookingDto } from './dto/create-booking.dto';
import { UpdateBookingDto } from './dto/update-booking.dto';
import { MailerService } from 'src/common/services/mailer.service';

@Injectable()
export class BookingsService {
  constructor(
    private prisma: PrismaService,
    private readonly mailerService: MailerService,
  ) {}

  async create(dto: CreateBookingDto, userId: string) {
    // 1. Check for conflicting bookings
    const conflict = await this.prisma.booking.findFirst({
      where: {
        vehicleId: dto.vehicleId,
        AND: [
          { startDate: { lte: dto.endDate } },
          { endDate: { gte: dto.startDate } },
        ],
      },
    });

    if (conflict) {
      throw new BadRequestException('Vehicle is already booked during this period.');
    }

    // 2. Create booking
    const booking = await this.prisma.booking.create({
      data: {
        vehicleId: dto.vehicleId,
        startDate: dto.startDate,
        endDate: dto.endDate,
        totalAmount: dto.totalAmount,
        userId,
      },
      include: {
        vehicle: true,
        user: true,
      },
    });

    // 3. Mark vehicle as unavailable
    await this.prisma.vehicle.update({
      where: { id: dto.vehicleId },
      data: { isAvailable: false },
    });

    // 4. Send confirmation email
    await this.mailerService.sendBookingConfirmationEmail(
      booking.user.email,
      booking.user.firstName,
      `${booking.vehicle.make} ${booking.vehicle.model}`,
      dto.startDate.toString(),
      dto.endDate.toString(),
    );

    return booking;
  }

  findAll() {
    return this.prisma.booking.findMany({
      include: {
        vehicle: true,
        user: true,
      },
    });
  }

  findByUser(userId: string) {
    return this.prisma.booking.findMany({
      where: { userId },
      include: {
        vehicle: true,
      },
    });
  }

  async findOne(id: string) {
    const booking = await this.prisma.booking.findUnique({
      where: { id },
      include: { vehicle: true },
    });

    if (!booking) throw new NotFoundException('Booking not found');

    return booking;
  }

  async update(id: string, dto: UpdateBookingDto) {
    await this.findOne(id);

    return this.prisma.booking.update({
      where: { id },
      data: dto,
    });
  }

  async remove(id: string) {
    await this.findOne(id);

    return this.prisma.booking.delete({
      where: { id },
    });
  }
}
