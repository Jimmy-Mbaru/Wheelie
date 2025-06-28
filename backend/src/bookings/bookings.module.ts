import { Module } from '@nestjs/common';
import { BookingsService } from './bookings.service';
import { BookingsController } from './bookings.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { MailerModule } from 'src/common/services/mailer.module'; 

@Module({
  imports: [PrismaModule, MailerModule],
  controllers: [BookingsController],
  providers: [BookingsService],
})
export class BookingsModule {}
