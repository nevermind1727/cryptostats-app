import { Session } from 'express-session';
import { Types } from 'mongoose';

export type UserResponse = {
  _id: Types.ObjectId;
  email: string;
  isCoinbaseAuthorized: boolean;
};

export type CoinbaseTokenPayload = {
  access_token: string;
  refresh_token: string;
  expires_in: number;
};

export type SessionExtended = Session & Record<'user', UserResponse>;
