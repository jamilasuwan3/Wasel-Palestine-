import { Controller, Patch, Param, Body, Get } from '@nestjs/common';
import { CheckpointsService } from './checkpoints.service';

@Controller('checkpoints')
export class CheckpointsController {
  constructor(private readonly service: CheckpointsService) {}

  @Patch(':id/status')
  updateStatus(@Param('id') id: string, @Body() body: any) {
    return this.service.updateCheckpointStatus(Number(id), body.status);
  }

  @Get(':id/history')
  getHistory(@Param('id') id: string) {
    return this.service.getCheckpointHistory(Number(id));
  }
}