import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Type } from 'class-transformer';
import { ValidateNested } from 'class-validator';
import { HydratedDocument, SchemaTypes, Types } from 'mongoose';
import { Base } from './base';

export type LandDocument = HydratedDocument<Land>;

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
export class Land extends Base {
  _id?: Types.ObjectId;

  @Prop()
  name: string;

  @Prop()
  geofence: string[];

  @Prop()
  available: boolean;

  @Prop()
  price: number;

  @Prop({ type: SchemaTypes.ObjectId })
  batchId?: string;

  @Prop()
  size: string;

  @ValidateNested()
  @Type(() => Address)
  @Prop()
  address: Address;

  /*constructor(Land:Partial<Land>) {
    super(Land)
    Object.assign(this, Land)
  }*/
}

export const LandSchema = SchemaFactory.createForClass(Land);
