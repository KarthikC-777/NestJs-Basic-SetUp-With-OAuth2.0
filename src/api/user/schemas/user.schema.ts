import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Types } from 'mongoose';
import {
  UserDesignation,
  UserRole,
  UserStream,
} from '../enums/user-designation.enum';

@Schema({ timestamps: true })
export class User {
  @Prop({ type: mongoose.Schema.Types.ObjectId })
  _id: Types.ObjectId;

  @Prop()
  name: string;

  @Prop({ required: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop()
  phone_number: string;

  @Prop()
  companyId: string;

  @Prop({ required: true })
  role: UserRole[];

  @Prop({ required: true })
  title: UserDesignation;

  @Prop({ required: true })
  stream: UserStream;

  @Prop({ required: true })
  experience: number;

  @Prop({ required: true })
  allocated: boolean;

  @Prop({ required: true })
  current_allocated_projects: string[];

  @Prop()
  allocated_percentage: number;

  @Prop({ required: true })
  primary_skill: string[];

  @Prop({ required: true })
  secondary_skill: string[];

  @Prop()
  freeze_status?: boolean;

  @Prop()
  freezed_for_project?: Types.ObjectId;

  @Prop({ type: Date })
  createdAt?: Date;

  @Prop({ type: Date })
  updatedAt?: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);
