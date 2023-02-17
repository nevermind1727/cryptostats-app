import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { CoinbaseAuth } from 'src/coinbase/coinbase.schema';

export type UserDocument = HydratedDocument<User>;

@Schema()
export class User {
  @Prop({ required: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop()
  coinbaseAuth?: CoinbaseAuth;
}

export const UserSchema = SchemaFactory.createForClass(User);
