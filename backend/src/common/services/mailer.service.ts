import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { MailerService as NestMailerService } from '@nestjs-modules/mailer';

@Injectable()
export class MailerService {
  constructor(private readonly mailerService: NestMailerService) {}

  async sendWelcomeEmail(to: string, name: string) {
    try {
      await this.mailerService.sendMail({
        to,
        subject: 'Welcome to Car Rental!',
        html: `<h3>Hello ${name},</h3><p>Welcome to our platform. We’re excited to have you on Wheelzie 🚗</p>`,
      });
    } catch (error) {
      throw new InternalServerErrorException('Failed to send welcome email');
    }
  }

  async sendPasswordResetEmail(to: string, token: string) {
    try {
      const resetLink = `http://localhost:4200/reset-password?token=${token}`;
      await this.mailerService.sendMail({
        to,
        subject: 'Reset Your Password',
        html: `<p>Click the link below to reset your password:</p><a href="${resetLink}">${resetLink}</a>`,
      });
    } catch (error) {
      throw new InternalServerErrorException('Failed to send reset email');
    }
  }

  async sendBookingConfirmationEmail(
    to: string,
    name: string,
    vehicle: string,
    startDate: string,
    endDate: string,
  ) {
    try {
      await this.mailerService.sendMail({
        to,
        subject: 'Booking Confirmed - Car Rental',
        html: `
          <h3>Hi ${name},</h3>
          <p>Your booking for <strong>${vehicle}</strong> is confirmed!</p>
          <p><strong>From:</strong> ${startDate}<br>
          <strong>To:</strong> ${endDate}</p>
          <p>Thank you for choosing us! 🚗</p>
        `,
      });
    } catch (error) {
      throw new InternalServerErrorException('Failed to send booking confirmation email');
    }
  }
}
