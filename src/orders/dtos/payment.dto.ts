import { IsNumber, IsString } from 'class-validator';

export class PaymentDTO {
  @IsNumber()
  quantity: number;

  @IsString()
  creditId: string;

  @IsString()
  landId: string;

  @IsString()
  customerId: string;
}
