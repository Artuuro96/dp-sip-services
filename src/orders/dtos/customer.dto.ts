import { Type } from 'class-transformer';
import { IsEmail, IsString, IsUrl, IsObject, IsOptional, IsNotEmpty, ValidateNested, IsNumber } from 'class-validator';
import { AddressDTO } from './address.dto';

export class CustomerDTO {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  lastName: string;

  @IsString()
  secondLastName: string;

  @IsString()
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsNumber()
  @IsNotEmpty()
  cellPhone: number;

  @IsNumber()
  phone: number;

  @IsString()
  @IsNotEmpty()
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
