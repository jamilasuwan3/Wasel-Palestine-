import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Delete,
  Patch,
  UseGuards,
  Req,
} from '@nestjs/common';
import { IncidentsService } from './incidents.service';
import { CreateIncidentDto } from './dto/create-incident.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Roles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';


@Controller('incidents')
export class IncidentsController {
  constructor(private readonly incidentsService: IncidentsService) {}

@Get()
getAllIncidents(@Req() req: any) {
  return this.incidentsService.getAllIncidents(req.query);
}

@Get('stats/raw')
getIncidentStatsRaw() {
  return this.incidentsService.getIncidentStatsRaw();
}


  @Get(':id')
  getIncidentById(@Param('id') id: string) {
    return this.incidentsService.getIncidentById(Number(id));
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  
  @Roles('CITIZEN', 'ADMIN')
  @Post()
  createIncident(@Body() body: CreateIncidentDto, @Req() req: any) {
    return this.incidentsService.createIncident(body, req.user.sub);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @Delete(':id')
  deleteIncident(@Param('id') id: string) {
    return this.incidentsService.deleteIncident(Number(id));
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @Patch(':id')
  updateIncident(@Param('id') id: string, @Body() body: any) {
    return this.incidentsService.updateIncident(Number(id), body);
  }


  @UseGuards(JwtAuthGuard, RolesGuard)
@Roles('ADMIN', 'MODERATOR')
@Patch(':id/verify')
verifyIncident(@Param('id') id: string, @Req() req: any) {
  return this.incidentsService.verifyIncident(Number(id), req.user.sub);
}


}