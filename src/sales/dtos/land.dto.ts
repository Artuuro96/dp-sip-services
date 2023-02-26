import { Type } from 'class-transformer';
import {
  IsObject,
  IsString,
  ValidateNested,
  IsArray,
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsOptional,
} from 'class-validator';
import { AddressDTO } from './address.dto';

export class LandDTO {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsArray()
  @IsNotEmpty()
  geofence: string[];

  @IsBoolean()
  available: boolean;

  @IsNumber()
  price: number;

  @IsString()
  @IsOptional()
  batchId?: string;

  @IsString()
  @IsNotEmpty()
  size: string;

  @IsObject()
  @ValidateNested({ each: true })
  @Type(() => AddressDTO)
  address: AddressDTO;
}
