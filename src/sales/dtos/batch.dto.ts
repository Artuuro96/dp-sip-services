import {
  IsString,
  IsArray,
  IsNotEmpty,
  IsOptional,
  IsNumber,
} from 'class-validator';

export class BatchDTO {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsArray()
  @IsNotEmpty()
  landIds?: string[];

  @IsString()
  @IsNotEmpty()
  description?: string;

  @IsArray()
  @IsNotEmpty()
  geofence: string[];

  @IsNumber()
  @IsOptional()
  total_size?: number;
}
