import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';

@Injectable()
export class ReviewsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateReviewDto, userId: string) {
    // Prevent user from reviewing same vehicle twice
    const existing = await this.prisma.review.findFirst({
      where: { userId, vehicleId: dto.vehicleId },
    });

    if (existing) {
      throw new BadRequestException('You have already reviewed this vehicle.');
    }

    return this.prisma.review.create({
      data: {
        ...dto,
        userId,
      },
    });
  }

  async findAll(vehicleId?: string) {
    return this.prisma.review.findMany({
      where: vehicleId ? { vehicleId } : undefined,
      include: {
        user: {
          select: {
            firstName: true,
            lastName: true,
            avatarUrl: true,
          },
        },
        vehicle: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string) {
    const review = await this.prisma.review.findUnique({
      where: { id },
      include: { user: true, vehicle: true },
    });

    if (!review) {
      throw new NotFoundException('Review not found');
    }

    return review;
  }

  async update(id: string, userId: string, dto: UpdateReviewDto) {
    const review = await this.prisma.review.findUnique({ where: { id } });

    if (!review) {
      throw new NotFoundException('Review not found');
    }

    if (review.userId !== userId) {
      throw new ForbiddenException('You can only edit your own reviews.');
    }

    return this.prisma.review.update({
      where: { id },
      data: dto,
    });
  }

  async remove(id: string, userId: string) {
    const review = await this.prisma.review.findUnique({ where: { id } });

    if (!review) {
      throw new NotFoundException('Review not found');
    }

    if (review.userId !== userId) {
      throw new ForbiddenException('You can only delete your own reviews.');
    }

    return this.prisma.review.delete({ where: { id } });
  }
}
