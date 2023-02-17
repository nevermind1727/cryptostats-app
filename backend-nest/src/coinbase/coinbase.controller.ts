import { Controller, Get, Req, Res, UseGuards } from '@nestjs/common';
import { CoinbaseService } from './coinbase.service';
import { Request, Response } from 'express';
import { AuthenticatedGuard } from 'src/auth/guards/authenticated.guard';
import { GetCurrentUser } from 'src/decorators/get-current-user.decorator';
import { UserResponse } from 'src/utils/types';

@Controller('coinbase')
export class CoinbaseController {
  constructor(private readonly coinbaseService: CoinbaseService) {}

  @Get('auth')
  @UseGuards(AuthenticatedGuard)
  async authorize(@Res() res: Response): Promise<void> {
    return this.coinbaseService.authorize(res);
  }

  @Get('auth/callback')
  @UseGuards(AuthenticatedGuard)
  async handleCallback(
    @GetCurrentUser() user: UserResponse,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    return this.coinbaseService.handleCallback(req, res, user);
  }

  @Get()
  @UseGuards(AuthenticatedGuard)
  getCoinbaseData(@GetCurrentUser() user: UserResponse): Promise<any> {
    return this.coinbaseService.getPrimaryAccountTransactions(user._id);
  }
}
