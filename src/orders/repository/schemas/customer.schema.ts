import { Prop, Schema, SchemaFactory} from '@nestjs/mongoose';
import { Type } from 'class-transformer';
import { ValidateNested } from 'class-validator';
import { HydratedDocument, Types } from 'mongoose';
import { Base } from './base'

export type CustomerDocument = HydratedDocument<Customer>;

export class Address {
  @Prop()
  country: string;

  @Prop()
  state: string;

  @Prop()
  city: string;

  @Prop()
  town: string;

  @Prop()
  street: string;

  @Prop()
  number: string;

  @Prop()
  zip: number;
}

@Schema()
export class Customer extends Base {
  _id?: Types.ObjectId;
  
  @Prop({required: true})
  name: string;

  @Prop({required: true})
  lastName: string;

  @Prop()
  secondLastName: string;

  @Prop({required: true})
  email: string;

  @Prop()
  cellPhone: number;

  @Prop()
  phone?: number;

  @Prop({required: true})
  rfc: string;

  @Prop()
  facebook?: string;

  @ValidateNested()
  @Type(() => Address)
  @Prop()
  address: Address;

  @Prop({required: true})
  birthday: Date;

  @Prop()
  gender?: string;

  @Prop()
  avatar: string;

  /*constructor(customer:Partial<Customer>) {
    super(customer)
    Object.assign(this, customer)
  }*/
}

export const CustomerSchema = SchemaFactory.createForClass(Customer);
