import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Types } from 'mongoose';
import { currDate, toUTC } from '../../../utils/date_time.util';

@Schema({ timestamps: false })
export class Auth {
  @Prop({ type: mongoose.Schema.Types.ObjectId })
  _id: Types.ObjectId;

  @Prop({ type: mongoose.Schema.Types.ObjectId, required: true })
  userId: Types.ObjectId;

  @Prop([
    {
      _id: { type: Types.ObjectId, required: true },
      accessToken: { type: String, required: true },
      accessTokenExpiresIn: { type: Number, required: true },
      refreshToken: { type: String, required: true },
      refreshTokenExpiresIn: { type: Number, required: true },
    },
  ])
  sessions: {
    _id: Types.ObjectId;
    accessToken: string;
    accessTokenExpiresIn: number;
    refreshToken: string;
    refreshTokenExpiresIn: number;
  }[];

  @Prop({ type: Date, default: () => toUTC(currDate()) })
  createdAt?: Date;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'users',
    required: true,
  })
  createdBy: Types.ObjectId;

  @Prop({ type: Date })
  updatedAt?: Date;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'users' })
  updatedBy?: Types.ObjectId;
}

export const AuthSchema = SchemaFactory.createForClass(Auth);
