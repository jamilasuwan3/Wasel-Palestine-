import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AlertsController } from './alerts.controller';
import { AlertsService } from './alerts.service';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [
    PrismaModule,
    JwtModule.register({
      secret: 'wasel-secret',
      signOptions: { expiresIn: '1d' },
    }),
  ],
  controllers: [AlertsController],
  providers: [AlertsService],
})
export class AlertsModule {}