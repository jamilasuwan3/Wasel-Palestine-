import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class SubscriptionsService {
  constructor(private readonly prisma: PrismaService) {}

  createSubscription(body: any, userId: number) {
    return this.prisma.alertSubscription.create({
      data: {
        ...body,
        userId,
      },
    });
  }
}