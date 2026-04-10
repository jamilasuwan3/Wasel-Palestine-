import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { IncidentSeverity, IncidentStatus } from '@prisma/client';

export class CreateIncidentDto {
  @IsString()
  @IsNotEmpty()
  title!: string;

  @IsString()
  @IsNotEmpty()
  description!: string;

  @IsEnum(IncidentSeverity)
  severity!: IncidentSeverity;

  @IsEnum(IncidentStatus)
  status!: IncidentStatus;

  @IsString()
  @IsNotEmpty()
  location!: string;

  @IsString()
  @IsNotEmpty()
  category!: string;
}