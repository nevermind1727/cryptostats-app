import { Body, Controller, Get, Inject, Post } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dtos/create-user.dto';
import { UserResponse } from 'src/utils/types';
import { GetCurrentUser } from 'src/decorators/get-current-user.decorator';

@Controller('users')
export class UsersController {
  constructor(
    @Inject('USERS_SERVICE') private readonly usersService: UsersService,
  ) {}

  @Post('/')
  async createUser(
    @Body() createUserParams: CreateUserDto,
  ): Promise<UserResponse> {
    return this.usersService.createUser(createUserParams);
  }

  @Get('/')
  async getUser(@GetCurrentUser() user: UserResponse): Promise<UserResponse> {
    return user;
  }
}
