import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  async register(body: any) {
    const hashedPassword = await bcrypt.hash(body.password, 10);

    return this.prisma.user.create({
      data: {
        ...body,
        password: hashedPassword,
      },
    });
  }

  async login(body: any) {
  const user = await this.prisma.user.findUnique({
    where: { email: body.email },
  });

  if (!user) return { message: 'Invalid email or password' };

  const isPasswordValid = await bcrypt.compare(body.password, user.password);
  if (!isPasswordValid) return { message: 'Invalid email or password' };

  const accessToken = this.jwtService.sign(
    { sub: user.id, email: user.email, role: user.role },
    { secret: 'wasel-secret', expiresIn: '1d' },
  );

  const refreshToken = this.jwtService.sign(
    { sub: user.id },
    { secret: 'wasel-refresh-secret', expiresIn: '7d' },
  );

  const hashedRefreshToken = await bcrypt.hash(refreshToken, 10);

  await this.prisma.user.update({
    where: { id: user.id },
    data: { refreshToken: hashedRefreshToken },
  });

  return {
    message: 'Login successful',
    access_token: accessToken,
    refresh_token: refreshToken,
  };
}

async refreshToken(body: any) {
  const payload = this.jwtService.verify(body.refresh_token, {
    secret: 'wasel-refresh-secret',
  });

  const user = await this.prisma.user.findUnique({
    where: { id: payload.sub },
  });

  if (!user || !user.refreshToken) {
    return { message: 'Invalid refresh token' };
  }

  const isMatch = await bcrypt.compare(body.refresh_token, user.refreshToken);
  if (!isMatch) {
    return { message: 'Invalid refresh token' };
  }

  const newAccessToken = this.jwtService.sign(
    { sub: user.id, email: user.email, role: user.role },
    { secret: 'wasel-secret', expiresIn: '1d' },
  );

  return {
    access_token: newAccessToken,
  };
}
}