import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User, UserRole } from 'generated/prisma';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async create(createUserDto: CreateUserDto, currentUser?: User): Promise<User> {
    if (
      createUserDto.role &&
      ['ADMIN', 'SUPER_ADMIN'].includes(createUserDto.role as string) &&
      currentUser?.role !== UserRole.SUPER_ADMIN
    ) {
      throw new ForbiddenException(
        'Only SUPER_ADMIN can assign ADMIN or SUPER_ADMIN roles',
      );
    }

    if (!createUserDto.password) {
      throw new BadRequestException('Password is required');
    }

    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);

    return await this.prisma.user.create({
      data: {
        email: createUserDto.email,
        password: hashedPassword,
        role: createUserDto.role || UserRole.USER,
        firstName: createUserDto.firstName,
        lastName: createUserDto.lastName,
        phone: createUserDto.phone,
        avatarUrl: createUserDto.avatarUrl,
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

  async update(id: string, updateUserDto: UpdateUserDto, currentUser: User): Promise<User> {
    const userToUpdate = await this.findOne(id);

    if (id !== currentUser.id) {
      throw new ForbiddenException('You can only update your own profile');
    }

    return await this.prisma.user.update({
      where: { id },
      data: {
        ...updateUserDto,
        avatarUrl: updateUserDto.avatarUrl,
      },
    });
  }

  async updateProfile(userId: string, updateDto: UpdateUserDto): Promise<User> {
    return this.update(userId, updateDto, { id: userId } as User);
  }

  async remove(id: string): Promise<User> {
    await this.findOne(id);

    return await this.prisma.user.delete({
      where: { id },
    });
  }

  async getProfile(userId: string): Promise<User> {
    const user = await this.findOne(userId);
    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }
    return user;
  }

  async getRentalHistory(userId: string) {
    return this.prisma.booking.findMany({
      where: { userId },
      include: {
        vehicle: true,
      },
      orderBy: {
        startDate: 'desc',
      },
    });
  }
}