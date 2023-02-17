import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersRepository } from 'src/users/users.repository';
import { UserResponse } from 'src/utils/types';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(private readonly usersRepository: UsersRepository) {}

  async validateUser(email: string, password: string): Promise<UserResponse> {
    const existingUser = await this.usersRepository.findUserByEmail(email);
    if (!existingUser) {
      throw new UnauthorizedException(
        `No user with email: ${email} found. Provide a valid email.`,
      );
    }
    const isPasswordValid = await bcrypt.compare(
      password,
      existingUser.password,
    );
    if (!isPasswordValid) {
      throw new UnauthorizedException(`Invalid password.`);
    }

    return {
      _id: existingUser._id,
      email: email,
      isCoinbaseAuthorized: false,
    };
  }
}
