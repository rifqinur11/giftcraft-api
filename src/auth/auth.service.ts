import { Injectable, BadRequestException, UnauthorizedException, NotFoundException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  /**
   * Onboards a new tenant and their administrator user in a single transaction.
   */
  async register(data: any) {
    const { email, password, name, tenantName } = data;

    // Validate if email already exists (cross-tenant safety check using raw client)
    const existingUser = await this.prisma.raw.user.findUnique({
      where: { email },
    });
    if (existingUser) {
      throw new BadRequestException('Email is already registered.');
    }



    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    return this.prisma.raw.$transaction(async (tx) => {
      // 1. Create the Tenant
      const tenant = await tx.tenant.create({
        data: {
          name: tenantName,
        },
      });

      // 2. Create the Tenant Admin user
      const user = await tx.user.create({
        data: {
          email,
          password: hashedPassword,
          name,
          role: 'ADMIN',
          tenantId: tenant.id,
        },
      });

      return {
        message: 'Onboarding successful. Tenant created.',
        tenant: {
          id: tenant.id,
          name: tenant.name,
        },
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
        },
      };
    });
  }

  /**
   * Authenticates a user and issues a JWT token.
   */
  async login(data: any) {
    const { email, password } = data;

    // Find the user (using raw client because login is a cross-tenant operation)
    const user = await this.prisma.raw.user.findUnique({
      where: { email },
      include: { tenant: true },
    });

    if (!user) {
      throw new UnauthorizedException('Invalid email or password.');
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid email or password.');
    }

    // Generate JWT token
    const payload = {
      sub: user.id,
      email: user.email,
      role: user.role,
      tenantId: user.tenantId,
    };

    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
      tenant: {
        id: user.tenant.id,
        name: user.tenant.name,
      },
    };
  }

  async getMe(userId: string) {
    // This is automatically tenant-scoped if queried via this.prisma.db
    const user = await this.prisma.db.user.findUnique({
      where: { id: userId },
    });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    const { password, ...result } = user;
    return result;
  }
}
