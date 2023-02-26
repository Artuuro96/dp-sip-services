import { Prop, Schema } from '@nestjs/mongoose';
import { HydratedDocument, SchemaTypes } from 'mongoose';

export type BaseDocument = HydratedDocument<Base>;

@Schema()
export class Base {
  @Prop({ default: false })
  deleted?: boolean;

  @Prop({ default: new Date() })
  createdAt?: Date;

  @Prop({ type: SchemaTypes.ObjectId })
  createdBy: string;

  @Prop({ default: new Date() })
  updatedAt?: Date;

  @Prop({ type: SchemaTypes.ObjectId })
  updatedBy?: string;

  @Prop()
  deletedAt?: Date;

  @Prop({ type: SchemaTypes.ObjectId })
  deletedBy?: string;

  /*constructor(base:Partial<Base>) {
        Object.assign(this, base)
    }*/
}
