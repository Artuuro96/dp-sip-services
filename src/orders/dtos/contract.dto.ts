import { IsString, IsOptional, IsNotEmpty } from 'class-validator';
import { PaymentTypeEnum } from '../repository/enums/payment.enum';

export class ContractDTO {
  @IsString()
  @IsNotEmpty()
  landId: string;

  @IsString()
  @IsOptional()
  customerId: string;

  @IsString()
  @IsOptional()
  sellerId?: string;

  @IsString()
  @IsOptional()
  creditId?: string;

  @IsString()
  paymentType: PaymentTypeEnum;
}
