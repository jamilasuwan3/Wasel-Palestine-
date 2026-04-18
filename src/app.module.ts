import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { IncidentsModule } from './incidents/incidents.module';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { ReportsModule } from './reports/reports.module';
import { SubscriptionsModule } from './subscriptions/subscriptions.module';
import { AlertsModule } from './alerts/alerts.module';
import { WeatherModule } from './weather/weather.module';
import { MapsModule } from './maps/maps.module';
import { CheckpointsModule } from './checkpoints/checkpoints.module';

@Module({
  
  imports: [IncidentsModule,   CheckpointsModule, PrismaModule, AuthModule, UsersModule, ReportsModule, AlertsModule,   SubscriptionsModule, WeatherModule, MapsModule],
  controllers: [AppController],
  providers: [AppService],
  
})
export class AppModule {}