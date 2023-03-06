import { IsString, IsArray, IsNotEmpty, IsOptional, IsNumber } from 'class-validator';

export class BatchDTO {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsArray()
  @IsOptional()
  landIds?: string[];

  @IsString()
  @IsNotEmpty()
  description?: string;

  @IsArray()
  @IsNotEmpty()
  geofence: string[];

  @IsNumber()
  @IsOptional()
  totalSize?: number;
}
