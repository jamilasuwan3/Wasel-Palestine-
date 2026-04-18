import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateIncidentDto } from './dto/create-incident.dto';

@Injectable()
export class IncidentsService {
  constructor(private readonly prisma: PrismaService) {}
getAllIncidents(query: any) {
  const {
    status,
    severity,
    category,
    location,
    page = 1,
    limit = 10,
    sortBy = 'createdAt',
    order = 'desc',
  } = query;

  const allowedSortFields = ['createdAt', 'severity', 'status', 'location'];
  const safeSortBy = allowedSortFields.includes(sortBy) ? sortBy : 'createdAt';
  const safeOrder = order === 'asc' ? 'asc' : 'desc';

  return this.prisma.incident.findMany({
    where: {
      status: status || undefined,
      severity: severity || undefined,
      category: category || undefined,
      location: location || undefined,
    },
    skip: (Number(page) - 1) * Number(limit),
    take: Number(limit),
    orderBy: {
      [safeSortBy]: safeOrder,
    },
    include: {
      verifiedBy: {
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
        },
      },
    },
  });
}

async getIncidentStatsRaw() {
  const result = await this.prisma.$queryRawUnsafe(`
    SELECT status, COUNT(*)::int AS count
    FROM "Incident"
    GROUP BY status
    ORDER BY count DESC
  `);

  return result;
}

 getIncidentById(id: number) {
  return this.prisma.incident.findUnique({
    where: { id },
  include: {
  verifiedBy: {
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
    },
  },
},
  });
}

createIncident(body: CreateIncidentDto, userId: number) {
  return this.prisma.$transaction(async (prisma) => {
    const incident = await prisma.incident.create({
      data: {
        ...body,
        verifiedById: userId,
      },
    });

    const subscriptions = await prisma.alertSubscription.findMany({
      where: {
        area: body.location,
        incidentCategory: body.category,
      },
    });

    if (subscriptions.length > 0) {
      await prisma.alert.createMany({
        data: subscriptions.map((sub) => ({
          userId: sub.userId,
          incidentId: incident.id,
          message: `New ${body.category} incident in ${body.location}`,
        })),
      });
    }

    return incident;
  });
}

  deleteIncident(id: number) {
    return this.prisma.incident.delete({
      where: { id },
    });
  }

  updateIncident(id: number, body: any) {
    return this.prisma.incident.update({
      where: { id },
      data: body,
    });
  }

  verifyIncident(id: number, userId: number) {
  return this.prisma.incident.update({
    where: { id },
    data: {
      status: 'VERIFIED',
      verifiedById: userId,
    },
  });
}
}