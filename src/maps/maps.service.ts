import { BadRequestException, Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class MapsService {
  constructor(private readonly httpService: HttpService) {}

  async getRoute(
    fromLat: string,
    fromLng: string,
    toLat: string,
    toLng: string,
  ) {
    if (!fromLat || !fromLng || !toLat || !toLng) {
      throw new BadRequestException(
        'fromLat, fromLng, toLat, and toLng are required',
      );
    }

    const url = `https://router.project-osrm.org/route/v1/driving/${fromLng},${fromLat};${toLng},${toLat}?overview=false&steps=true`;

    const response = await firstValueFrom(this.httpService.get(url));
    const data = response.data;

    if (!data.routes || data.routes.length === 0) {
      throw new BadRequestException('No route found');
    }

    const route = data.routes[0];

    return {
      distanceInMeters: route.distance,
      durationInSeconds: route.duration,
      distanceInKm: (route.distance / 1000).toFixed(2),
      durationInMinutes: (route.duration / 60).toFixed(2),
      from: data.waypoints[0]?.name || 'Start',
      to: data.waypoints[1]?.name || 'Destination',
    };
  }
}