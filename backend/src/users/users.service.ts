import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User, UserRole } from 'generated/prisma';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) { }

  // Enforce only SUPER_ADMIN can assign ADMIN or SUPER_ADMIN roles
  async create(createUserDto: CreateUserDto, currentUser?: User): Promise<User> {
    // If the current user is not a super admin and attempts to assign elevated roles
    if (
      createUserDto.role &&
      ['ADMIN', 'SUPER_ADMIN'].includes(createUserDto.role as string) &&
      currentUser?.role !== UserRole.SUPER_ADMIN
    ) {
      throw new ForbiddenException(
        'Only SUPER_ADMIN can assign ADMIN or SUPER_ADMIN roles',
      );
    }

    return await this.prisma.user.create({
      data: {
        ...createUserDto,
        role: createUserDto.role || UserRole.USER, // fallback to USER
      },
    });
  }

  async findAll(): Promise<User[]> {
    return await this.prisma.user.findMany();
  }

  async findOne(id: string): Promise<User> {
    const user = await this.prisma.user.findUnique({
      where: { id },
    });

    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    return user;
  }

  async findByEmail(email: string) {
    return await this.prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        email: true,
        password: true,
        role: true,
        firstName: true,
        lastName: true,
        phone: true,
        avatarUrl: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    await this.findOne(id);

    return await this.prisma.user.update({
      where: { id },
      data: updateUserDto,
    });
  }

  async remove(id: string): Promise<User> {
    await this.findOne(id);

    return await this.prisma.user.delete({
      where: { id },
    });
  }

  // Get current user profile (/users/me)
  async getProfile(userId: string): Promise<User> {
    return this.findOne(userId);
  }

  // Update current user profile (/users/me PATCH)
  async updateProfile(userId: string, updateDto: UpdateUserDto): Promise<User> {
    return this.prisma.user.update({
      where: { id: userId },
      data: updateDto,
    });
  }

  async getRentalHistory(userId: string) {
    return this.prisma.booking.findMany({
      where: { userId },
      include: {
        vehicle: true, // Includes details about the booked car
      },
      orderBy: {
        startDate: 'desc', // Optional: show latest bookings first
      },
    });
  }

}
