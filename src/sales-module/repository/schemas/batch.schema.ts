import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, SchemaTypes, Types } from 'mongoose';
import { Base } from './base';

export type BatchDocument = HydratedDocument<Batch>;

@Schema()
export class Batch extends Base {
  _id?: Types.ObjectId;

  @Prop()
  name: string;

  @Prop([{ type: SchemaTypes.ObjectId }])
  landIds?: string[];

  @Prop()
  description?: string;

  @Prop()
  geofence: string[];

  @Prop()
  total_size?: number;

  /*constructor(Batch:Partial<Batch>) {
    super(Batch)
    Object.assign(this, Batch)
  }*/
}

export const BatchSchema = SchemaFactory.createForClass(Batch);
