import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ReportsService {
  constructor(private readonly prisma: PrismaService) {}

  createReport(body: any, userId: number) {
    return this.prisma.report.create({
      data: {
        ...body,
        userId,
      },
    });
  }

  getAllReports() {
    return this.prisma.report.findMany({
      include: {
        user: true,
      },
    });
  }

  approveReport(id: number) {
  return this.prisma.report.update({
    where: { id },
    data: {
      status: 'APPROVED',
    },
  });
}

rejectReport(id: number) {
  return this.prisma.report.update({
    where: { id },
    data: {
      status: 'REJECTED',
    },
  });
}

async voteReport(reportId: number, userId: number, value: number) {
  await this.prisma.reportVote.create({
    data: {
      reportId,
      userId,
      value,
    },
  });

  const votes = await this.prisma.reportVote.findMany({
    where: { reportId },
  });

  const totalScore = votes.reduce((sum, vote) => sum + vote.value, 0);

  await this.prisma.report.update({
    where: { id: reportId },
    data: {
      credibilityScore: totalScore,
    },
  });

  return {
    message: 'Vote added successfully',
    credibilityScore: totalScore,
  };
}
}