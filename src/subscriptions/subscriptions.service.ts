import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class SubscriptionsService {
  constructor(private readonly prisma: PrismaService) {}

async createSubscription(body: any, userId: number) {
  const existing = await this.prisma.alertSubscription.findFirst({
    where: {
      userId,
      area: body.area,
      incidentCategory: body.incidentCategory,
    },
  });

  if (existing) {
    return { message: 'Subscription already exists' };
  }

  return this.prisma.alertSubscription.create({
    data: {
      area: body.area,
      incidentCategory: body.incidentCategory,
      userId,
    },
  });
}
  
getUserSubscriptions(userId: number) {
  return this.prisma.alertSubscription.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
  });
}

}


