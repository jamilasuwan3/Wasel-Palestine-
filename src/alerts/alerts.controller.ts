import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { AlertsService } from './alerts.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('alerts')
export class AlertsController {
  constructor(private readonly alertsService: AlertsService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  getMyAlerts(@Req() req: any) {
    return this.alertsService.getMyAlerts(req.user.sub);
  }
}