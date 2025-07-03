import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class AdminService {
  constructor(private readonly prisma: PrismaService) {}

async getDashboardStats() {
  const [
    totalUsers,
    totalBookings,
    activeVehicles,
    totalRevenue,
    topVehicles,
  ] = await Promise.all([
    this.prisma.user.count(),
    this.prisma.booking.count(),
    this.prisma.vehicle.count({ where: { isAvailable: true } }),
    this.prisma.payment.aggregate({
      _sum: { amount: true },
    }),
    this.prisma.booking.groupBy({
      by: ['vehicleId'],
      _count: { vehicleId: true },
      orderBy: { _count: { vehicleId: 'desc' } },
      take: 5,
    }),
  ]);

  // Fetch top 5 most booked vehicles with basic details
  const vehicleDetails = await Promise.all(
    topVehicles.map(async (item) => {
      const vehicle = await this.prisma.vehicle.findUnique({
        where: { id: item.vehicleId },
        select: {
          id: true,
          make: true,
          model: true,
          year: true,
          imageUrl: true,
        },
      });

      return {
        ...vehicle,
        bookings: item._count.vehicleId,
      };
    }),
  );

  const result = {
    totalUsers,
    totalBookings,
    activeVehicles,
    totalRevenue: totalRevenue._sum.amount || 0,
    topVehicles: vehicleDetails.filter(Boolean),
  };

  console.log('Dashboard Stats Result:', result); // Debug log
  return result;
}
}
