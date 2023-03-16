import { IsString, IsNotEmpty, IsNumber, IsOptional } from 'class-validator';
import { CreditStatusEnum } from '../repository/enums/credit.enum';
import { TermTypeEnum } from '../repository/enums/term.enum copy';

export class CreditDTO {
  @IsString()
  @IsNotEmpty()
  contractId: string;

  @IsString()
  @IsNotEmpty()
  customerId: string;

  @IsString()
  @IsOptional()
  landId?: string;

  @IsString()
  @IsOptional()
  batchId?: string;

  @IsString()
  @IsNotEmpty()
  creditNumber: string;

  @IsString()
  @IsNotEmpty()
  startDate: string;

  @IsString()
  @IsNotEmpty()
  endDate: string;

  @IsString()
  @IsNotEmpty()
  status: CreditStatusEnum;

  @IsString()
  @IsNotEmpty()
  termType: TermTypeEnum;

  @IsNumber()
  termQuantity: number;

  @IsNumber() //Dia de pago
  paymentDay: number;

  @IsNumber()
  regularPayment: number;

  @IsNumber()
  totalDebt: number;

  @IsNumber()
  interestRate: number;
}
