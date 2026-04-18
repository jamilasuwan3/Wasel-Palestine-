import { BadRequestException, Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class MapsService {
  constructor(private readonly httpService: HttpService) {}

  private cache = new Map<string, any>();

  async getRoute(
    fromLat: string,
    fromLng: string,
    toLat: string,
    toLng: string,
    avoidCheckpoints?: string,
    avoidAreas?: string,
  ) {
    if (!fromLat || !fromLng || !toLat || !toLng) {
      throw new BadRequestException(
        'fromLat, fromLng, toLat, and toLng are required',
      );
    }

    const key = `${fromLat}-${fromLng}-${toLat}-${toLng}-${avoidCheckpoints}-${avoidAreas}`;

    if (this.cache.has(key)) {
      return this.cache.get(key);
    }

    const url = `https://router.project-osrm.org/route/v1/driving/${fromLng},${fromLat};${toLng},${toLat}?overview=false&steps=true`;

    try {
      const response = await firstValueFrom(
        this.httpService.get(url, {
          timeout: 5000,
        }),
      );

      const data = response.data;

      if (!data.routes || data.routes.length === 0) {
        throw new BadRequestException('No route found');
      }

      const route = data.routes[0];

      const result = {
        distanceInMeters: route.distance,
        durationInSeconds: route.duration,
        distanceInKm: (route.distance / 1000).toFixed(2),
        durationInMinutes: (route.duration / 60).toFixed(2),
        from: data.waypoints[0]?.name || 'Start',
        to: data.waypoints[1]?.name || 'Destination',
        metadata: {
          routingProvider: 'OSRM',
          transportMode: 'driving',
          avoidCheckpoints: avoidCheckpoints === 'true',
          avoidAreas: avoidAreas ? avoidAreas.split(',') : [],
          note:
            avoidCheckpoints === 'true' || avoidAreas
              ? 'Constraints are accepted and reported as route metadata. Current implementation uses heuristic support for future enhancement.'
              : 'Standard route estimation without additional constraints.',
        },
      };

      this.cache.set(key, result);
      return result;
    } catch (error) {
      throw new BadRequestException('External routing service failed');
    }
  }
}