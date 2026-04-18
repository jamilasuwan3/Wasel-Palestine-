import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class CheckpointsService {
  constructor(private prisma: PrismaService) {}

  async updateCheckpointStatus(id: number, status: string) {
    return this.prisma.$transaction(async (prisma) => {
      const checkpoint = await prisma.checkpoint.update({
        where: { id },
        data: { currentStatus: status },
      });

      await prisma.checkpointStatus.create({
        data: {
          checkpointId: id,
          status,
          changedAt: new Date(),
        },
      });

      return checkpoint;
    });
  }

  async getCheckpointHistory(id: number) {
    return this.prisma.checkpointStatus.findMany({
      where: { checkpointId: id },
      orderBy: { changedAt: 'desc' },
    });
  }
}