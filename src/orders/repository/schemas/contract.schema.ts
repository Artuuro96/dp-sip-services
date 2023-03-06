import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, SchemaTypes, Types } from 'mongoose';
import { ContractStatusEnum } from '../enums/contract.enum';
import { PaymentTypeEnum } from '../enums/payment.enum';
import { Base } from './base';

export type ContractDocument = HydratedDocument<Contract>;

@Schema()
export class Contract extends Base {
  _id?: Types.ObjectId;

  @Prop()
  contractNumber: string;

  @Prop()
  paymentType: PaymentTypeEnum;

  @Prop({ type: SchemaTypes.ObjectId })
  creditId?: string;

  @Prop()
  sellerId: string;

  @Prop({ type: SchemaTypes.ObjectId })
  customerId?: string;

  @Prop({ type: SchemaTypes.ObjectId })
  landId?: string;

  @Prop({ type: SchemaTypes.ObjectId })
  batchId?: string;

  @Prop()
  status?: ContractStatusEnum;

  /*constructor(Contract:Partial<Contract>) {
    super(Contract)
    Object.assign(this, Contract)
  }*/
}

export const ContractSchema = SchemaFactory.createForClass(Contract);
