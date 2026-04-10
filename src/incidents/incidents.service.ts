import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateIncidentDto } from './dto/create-incident.dto';

@Injectable()
export class IncidentsService {
  constructor(private readonly prisma: PrismaService) {}
getAllIncidents(query: any) {
  const { status, severity, page = 1, limit = 10, sortBy = 'createdAt', order = 'desc' } = query;

  return this.prisma.incident.findMany({
    where: {
      status: status || undefined,
      severity: severity || undefined,
    },
    skip: (Number(page) - 1) * Number(limit),
    take: Number(limit),
    orderBy: {
      [sortBy]: order,
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