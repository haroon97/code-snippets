import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { Badge } from 'src/badges/schema/badge.schema';

export type UserDocument = HydratedDocument<User>;

@Schema()
export class User {
  @Prop({ required: true })
  firstName: string;

  @Prop({ required: true })
  lastName: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  firebase_id: string;

  @Prop({
    type: mongoose.Schema.Types.Map,
    of: { target: Number, resourceIds: [{ type: String }] },
    default: {},
  })
  milestones: Map<string, { target: number; resourceIds: string[] }>;

  @Prop({
    type: [{ type: mongoose.Types.ObjectId, ref: 'Badge', default: [] }],
  })
  badges: Badge[];
}

export const UserSchema = SchemaFactory.createForClass(User);
