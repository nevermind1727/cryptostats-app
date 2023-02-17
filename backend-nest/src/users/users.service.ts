import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dtos/create-user.dto';
import { UsersRepository } from './users.repository';
import { UserResponse } from 'src/utils/types';
import { UserDocument } from './users.schema';
import * as bcrypt from 'bcrypt';
import {
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common/exceptions';
import { Types } from 'mongoose';
import { CoinbaseAuth } from 'src/coinbase/coinbase.schema';

@Injectable()
export class UsersService {
  constructor(private readonly usersRepository: UsersRepository) {}

  async createUser(createUserParams: CreateUserDto): Promise<UserResponse> {
    await this.validateUserByEmail(createUserParams);
    const newUser = await this.usersRepository.insertOne({
      ...createUserParams,
      password: await bcrypt.hash(createUserParams.password, 10),
    });
    return this.buildUserResponse(newUser);
  }

  async validateUserById(id: Types.ObjectId): Promise<UserResponse> {
    const userById = await this.usersRepository.findUserById(id);
    if (!userById) throw new UnauthorizedException(`No user with id: ${id}`);
    return this.buildUserResponse(userById);
  }

  async updateUser(
    userId: Types.ObjectId,
    data: Partial<UserDocument>,
  ): Promise<UserResponse> {
    const updatedUser = await this.usersRepository.updateUser(userId, data);
    if (!updatedUser) {
      throw new BadRequestException(
        `Error occured when update user with id: ${userId}`,
      );
    }
    return this.buildUserResponse(updatedUser);
  }

  async getCoinbaseAuth(userId: Types.ObjectId): Promise<CoinbaseAuth> {
    const user = await this.usersRepository.findUserById(userId);
    if (!user)
      throw new NotFoundException(`User with id: ${userId} wasn't found`);
    if (!user.coinbaseAuth)
      throw new UnauthorizedException(
        `User with id: ${userId} has not authorized to Coinbase`,
      );
    return user.coinbaseAuth;
  }

  private async validateUserByEmail(
    createUserParams: CreateUserDto,
  ): Promise<void> {
    const user = await this.usersRepository.findUserByEmail(
      createUserParams.email,
    );
    if (user)
      throw new BadRequestException(
        `User with email: ${createUserParams.email} already exists!`,
      );
  }

  private buildUserResponse(user: UserDocument): UserResponse {
    return {
      _id: user._id,
      email: user.email,
      isCoinbaseAuthorized: !!user.coinbaseAuth,
    };
  }
}
