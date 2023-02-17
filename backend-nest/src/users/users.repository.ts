import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from './users.schema';
import { Model, Types } from 'mongoose';

export class UsersRepository {
  constructor(@InjectModel(User.name) private user: Model<UserDocument>) {}

  async insertOne(params: User): Promise<UserDocument> {
    const newUser = new this.user(params);
    return newUser.save();
  }

  async findUserByEmail(email: string): Promise<UserDocument> {
    return this.user.findOne({ email });
  }

  async findUserById(id: Types.ObjectId): Promise<UserDocument> {
    return this.user.findById(id);
  }

  async updateUser(
    userId: Types.ObjectId,
    data: Partial<UserDocument>,
  ): Promise<UserDocument> {
    return this.user.findByIdAndUpdate(userId, data, { new: true });
  }
}
