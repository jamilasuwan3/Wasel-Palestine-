import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class WeatherService {
  constructor(private readonly httpService: HttpService) {}

  async getWeatherByCity(city: string) {
    if (!city) {
      throw new BadRequestException('city query is required');
    }

    const geoUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1&language=en&format=json`;

    const geoResponse = await firstValueFrom(this.httpService.get(geoUrl));
    const geoData = geoResponse.data;

    if (!geoData.results || geoData.results.length === 0) {
      throw new NotFoundException('City not found');
    }

    const place = geoData.results[0];

    const weatherUrl =
      `https://api.open-meteo.com/v1/forecast` +
      `?latitude=${place.latitude}` +
      `&longitude=${place.longitude}` +
      `&current=temperature_2m,wind_speed_10m,weather_code` +
      `&timezone=auto`;

    const weatherResponse = await firstValueFrom(this.httpService.get(weatherUrl));
    const weatherData = weatherResponse.data;

    return {
      city: place.name,
      country: place.country,
      latitude: place.latitude,
      longitude: place.longitude,
      temperature: weatherData.current?.temperature_2m,
      windSpeed: weatherData.current?.wind_speed_10m,
      weatherCode: weatherData.current?.weather_code,
      time: weatherData.current?.time,
    };
  }
}