import {
  Injectable,
  UnauthorizedException,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcryptjs';
import { User } from 'generated/prisma';
import { JwtPayload } from 'src/common/interfaces/jwt-payload.interface';
import { MailerService } from 'src/common/services/mailer.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { randomBytes } from 'crypto';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly mailerService: MailerService,
    private readonly prisma: PrismaService,
  ) { }

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.usersService.findByEmail(email);
    if (user && (await bcrypt.compare(password, user.password))) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async login(user: any) {
    const payload: JwtPayload = {
      sub: user.id,
      email: user.email,
      role: user.role,
    };

    return {
      access_token: this.jwtService.sign(payload),
      user,
    };
  }

  async register(createAuthDto: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
  }) {
    const hashedPassword = await bcrypt.hash(createAuthDto.password, 10);
    const newUser = await this.usersService.create({
      ...createAuthDto,
      password: hashedPassword,
    });

    // Send Welcome Email
    await this.mailerService.sendWelcomeEmail(
      newUser.email,
      newUser.firstName
    );


    return newUser;
  }

  async forgotPassword(email: string) {
    const user = await this.usersService.findByEmail(email);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const token = randomBytes(32).toString('hex');
    const expiresAt = new Date(Date.now() + 1000 * 60 * 15);

    await this.prisma.passwordReset.upsert({
      where: { userId: user.id },
      update: { token, expiresAt },
      create: { userId: user.id, token, expiresAt },
    });

    const resetLink = `http://localhost:4200/reset-password?token=${token}`; // or your frontend URL

    await this.mailerService.sendPasswordResetEmail(
      user.email,
      token
    );


    return { message: 'Reset link sent to your email' };
  }

  async resetPassword(token: string, newPassword: string): Promise<any> {
    const resetRequest = await this.prisma.passwordReset.findUnique({
      where: { token },
    });

    if (!resetRequest || resetRequest.expiresAt < new Date()) {
      throw new BadRequestException('Reset link is invalid or has expired');
    }

    const hashed = await bcrypt.hash(newPassword, 10);
    await this.prisma.user.update({
      where: { id: resetRequest.userId },
      data: { password: hashed },
    });

    // Optionally delete the reset record after use
    await this.prisma.passwordReset.delete({
      where: { token },
    });

    return { message: 'Password reset successful' };
  }

}
