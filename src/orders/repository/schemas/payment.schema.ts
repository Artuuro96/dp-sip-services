import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, SchemaTypes, Types } from 'mongoose';
import { getCurrentPaymentDate } from 'src/helpers/date.helper';
import { ContractStatusEnum } from '../enums/contract.enum';
import { Base } from './base';

export type PaymentDocument = HydratedDocument<Payment>;

@Schema()
export class Payment extends Base {
  _id?: Types.ObjectId;

  @Prop({ type: SchemaTypes.ObjectId })
  customerId: string;

  @Prop({ type: SchemaTypes.ObjectId })
  creditId: string;

  @Prop({ type: SchemaTypes.ObjectId })
  landId?: string;

  @Prop()
  paymentDate: Date;

  @Prop()
  quantity?: number;

  @Prop()
  advance: number;

  @Prop()
  invoice?: ContractStatusEnum;

  isOnTime(paymentDay: number): boolean {
    return new Date() <= getCurrentPaymentDate(paymentDay);
  }
}

export const PaymentSchema = SchemaFactory.createForClass(Payment);
