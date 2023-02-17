import {
  Controller,
  Post,
  UseGuards,
  Session as GetSession,
  Get,
  Res,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { SessionExtended, UserResponse } from 'src/utils/types';
import { GetCurrentUser } from 'src/decorators/get-current-user.decorator';
import { AuthenticatedGuard } from './guards/authenticated.guard';
import { Response } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post('/login')
  async login(@GetCurrentUser() user: UserResponse, @Res() res: Response) {
    res.send(user);
  }

  @UseGuards(AuthenticatedGuard)
  @Get()
  async getAuthSession(
    @GetSession() session: SessionExtended,
    @GetCurrentUser() user: UserResponse,
  ) {
    console.log(user);
    console.log(session);
    console.log(session.id);
    return session;
  }
}
