import { Type } from 'class-transformer';
import { IsEmail, IsString, IsUrl, IsObject, IsOptional, ValidateNested, IsNumber } from 'class-validator';
import { AddressDTO } from './address.dto';

export class CustomerDTO {
  @IsString()
  name: string;

  @IsString()
  lastName: string;

  @IsString()
  secondLastName: string;

  @IsString()
  @IsEmail()
  email: string;

  @IsNumber()
  cellPhone: number;

  @IsNumber()
  phone: number;

  @IsString()
  rfc: string;

  @IsString()
  facebook?: string;

  @IsObject()
  @ValidateNested({ each: true })
  @Type(() => AddressDTO)
  address: AddressDTO;

  @IsString()
  birthday: string;

  @IsString()
  @IsOptional()
  gender?: string;

  @IsUrl()
  avatar: string;
}
