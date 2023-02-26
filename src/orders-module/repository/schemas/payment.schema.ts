import { Prop, Schema, SchemaFactory} from '@nestjs/mongoose';
import { HydratedDocument, SchemaTypes, Types } from 'mongoose';
import { ContractStatusEnum } from '../enums/contract.enum';
import { PaymentTypeEnum } from '../enums/payment.enum';
import { Base } from './base'

export type PaymentDocument = HydratedDocument<Payment>;

@Schema()
export class Payment extends Base {
  _id?: Types.ObjectId;
  
  @Prop({ type: SchemaTypes.ObjectId })
  customerId: string;

  @Prop()
  creditId: PaymentTypeEnum;

  @Prop({ type: SchemaTypes.ObjectId })
  landId?: string;

  @Prop()
  paymentDate: Date;

  @Prop()
  payment?: number;

  @Prop()
  advance: number;

  @Prop()
  invoice?: ContractStatusEnum;

  /*constructor(Payment:Partial<Payment>) {
    super(Payment)
    Object.assign(this, Payment)
  }*/
}

export const PaymentSchema = SchemaFactory.createForClass(Payment);
