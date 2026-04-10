import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { IncidentsController } from './incidents.controller';
import { IncidentsService } from './incidents.service';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [
    PrismaModule,
    JwtModule.register({
      secret: 'wasel-secret',
      signOptions: { expiresIn: '1d' },
    }),
  ],
  controllers: [IncidentsController],
  providers: [IncidentsService],
})
export class IncidentsModule {}