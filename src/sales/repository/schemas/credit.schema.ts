import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, SchemaTypes, Types } from 'mongoose';
import { CreditStatusEnum } from '../enums/credit.enum';
import { TermTypeEnum } from '../enums/term.enum copy';
import { Base } from './base';

export type CreditDocument = HydratedDocument<Credit>;

@Schema()
export class Credit extends Base {
  _id?: Types.ObjectId;

  @Prop()
  contractId: string;

  @Prop({ type: SchemaTypes.ObjectId })
  customerId: string;

  @Prop({ type: SchemaTypes.ObjectId })
  landId?: string;

  @Prop({ type: SchemaTypes.ObjectId })
  batchId?: string;

  @Prop()
  creditNumber: string;

  @Prop()
  startDate: Date;

  @Prop()
  endDate: Date;

  @Prop()
  status: CreditStatusEnum;

  @Prop()
  termType: TermTypeEnum;

  @Prop() //Plazo a pagar va relacionado a term
  termQuantity: number;

  @Prop() //Dia de pago
  paymentDay: number;

  @Prop() //Cuanto debes pagar
  regularPayment: number;

  @Prop()
  totalDebt: number;

  @Prop()
  currentBalance: number;

  @Prop([{ type: SchemaTypes.ObjectId, default: [] }])
  paymentIds?: string[];

  @Prop()
  interestRate: number;

  @Prop()
  totalPayments?: number;

  isAssigned(): boolean {
    return this.status === CreditStatusEnum.ASSIGNED;
  }

  isFinished(): boolean {
    return this.status === CreditStatusEnum.FINISHED;
  }

  isCancelled(): boolean {
    return this.status === CreditStatusEnum.CANCELLED;
  }

  hasBeenSettled(): boolean {
    return this.currentBalance === 0;
  }

  constructor(credit: Partial<Credit> = {}) {
    super();
    Object.assign(this, credit);
  }
}

export const CreditSchema = SchemaFactory.createForClass(Credit);
