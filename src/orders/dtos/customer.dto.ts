import { Type } from 'class-transformer';
import { IsEmail, IsString, IsUrl, IsObject, IsOptional, ValidateNested, IsDefined } from 'class-validator';
import { GenderEnum } from '../repository/enums/gender.enum';
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

  @IsString()
  @IsDefined()
  cellPhone: string;

  @IsString()
  @IsOptional()
  phone?: string;

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
  gender?: GenderEnum;

  @IsUrl()
  @IsOptional()
  avatar?: string;
}
