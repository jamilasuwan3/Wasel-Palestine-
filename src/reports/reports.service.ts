import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ReportsService {
  constructor(private readonly prisma: PrismaService) {}

async createReport(body: any, userId: number) {
  const existingReport = await this.prisma.report.findFirst({
    where: {
      userId,
      category: body.category,
      location: body.location,
      description: body.description,
      createdAt: {
        gte: new Date(Date.now() - 60 * 60 * 1000), // آخر ساعة
      },
    },
  });

  if (existingReport) {
    return {
      message: 'Duplicate report detected',
      existingReportId: existingReport.id,
    };
  }

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
  const existingVote = await this.prisma.reportVote.findFirst({
    where: {
      reportId,
      userId,
    },
  });

  if (existingVote) {
    return {
      message: 'You have already voted on this report',
    };
  }

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