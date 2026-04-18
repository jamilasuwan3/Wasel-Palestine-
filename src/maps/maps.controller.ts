import { Controller, Get, Query } from '@nestjs/common';
import { MapsService } from './maps.service';

@Controller('maps')
export class MapsController {
  constructor(private readonly mapsService: MapsService) {}

  @Get('route')
  getRoute(
    @Query('fromLat') fromLat: string,
    @Query('fromLng') fromLng: string,
    @Query('toLat') toLat: string,
    @Query('toLng') toLng: string,
    @Query('avoidCheckpoints') avoidCheckpoints?: string,
    @Query('avoidAreas') avoidAreas?: string,
  ) {
    return this.mapsService.getRoute(
      fromLat,
      fromLng,
      toLat,
      toLng,
      avoidCheckpoints,
      avoidAreas,
    );
  }
}