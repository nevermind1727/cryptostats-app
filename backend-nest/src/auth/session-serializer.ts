import { Inject } from '@nestjs/common';
import { PassportSerializer } from '@nestjs/passport';
import { UsersService } from 'src/users/users.service';
import { UserResponse } from 'src/utils/types';

export class SessionSerializer extends PassportSerializer {
  constructor(
    @Inject('USERS_SERVICE') private readonly usersService: UsersService,
  ) {
    super();
  }

  serializeUser(user: UserResponse, done: Function) {
    console.log(`Serialize user with id: ${user._id}`);
    done(null, user);
  }
  async deserializeUser(payload: UserResponse, done: Function) {
    console.log(`Deserialize user with id: ${payload._id}`);
    const existingUser = await this.usersService.validateUserById(payload._id);
    return existingUser ? done(null, existingUser) : done(null, null);
  }
}
