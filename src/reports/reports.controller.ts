import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { ReportsService } from './reports.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

import { Patch, Param} from '@nestjs/common';
import { Roles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';


@Controller('reports')
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  
  createReport(@Body() body: any, @Req() req: any) {
    return this.reportsService.createReport(body, req.user.sub);
  }

  @Get()
  getAllReports() {
    return this.reportsService.getAllReports();
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
@Roles('ADMIN', 'MODERATOR')
@Patch(':id/approve')
approveReport(@Param('id') id: string) {
  return this.reportsService.approveReport(Number(id));
}

@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('ADMIN', 'MODERATOR')
@Patch(':id/reject')
rejectReport(@Param('id') id: string) {
  return this.reportsService.rejectReport(Number(id));
}

@UseGuards(JwtAuthGuard)
@Post(':id/vote')
voteReport(
  @Param('id') id: string,
  @Body() body: any,
  @Req() req: any,
) {
  return this.reportsService.voteReport(Number(id), req.user.sub, body.value);
}
}