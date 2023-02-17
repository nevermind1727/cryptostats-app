import { HttpService } from '@nestjs/axios/dist';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Response, Request } from 'express';
import { Types } from 'mongoose';
import { UsersService } from 'src/users/users.service';
import { CoinbaseTokenPayload, UserResponse } from 'src/utils/types';
import { CoinbaseAuth } from './coinbase.schema';
import { EncryptionService } from 'src/auth/encryption.service';
import { lastValueFrom } from 'rxjs';

@Injectable()
export class CoinbaseService {
  constructor(
    private readonly configService: ConfigService,
    private readonly httpService: HttpService,
    private readonly usersService: UsersService,
    private readonly encryptionService: EncryptionService,
  ) {}

  async authorize(res: Response): Promise<void> {
    res.redirect(this.buildAuthorizeUrl().href);
    return;
  }

  async handleCallback(req: Request, res: Response, user: UserResponse) {
    const { code } = req.query;
    this.getTokenFromCode(code as string).subscribe(async (tokensResponse) => {
      await this.updateUserCoinbaseAuth(
        tokensResponse.data,
        (user as unknown as UserResponse)._id,
      );
      res.redirect(this.configService.get<string>('AUTH_REDIRECT_URI'));
    });
  }

  async getPrimaryAccountTransactions(userId: Types.ObjectId): Promise<any> {
    const primaryAccount = await this.getPrimaryAccount(userId);
    return this.getAccountTransactions(primaryAccount.id, userId);
  }

  async getAccountTransactions(
    accountId: string,
    userId: Types.ObjectId,
  ): Promise<any> {
    try {
      const response$ = this.httpService.get(
        `https://api.coinbase.com/v2/accounts/${accountId}/transactions`,
        {
          headers: await this.getHeaders(userId),
        },
      );
      const response = await lastValueFrom(response$);
      return response.data;
    } catch (err) {
      throw err.response.data;
    }
  }

  private async getPrimaryAccount(userId: Types.ObjectId): Promise<any> {
    try {
      const response$ = this.httpService.get(
        'https://api.coinbase.com/v2/accounts',
        {
          headers: await this.getHeaders(userId),
        },
      );
      const response = await lastValueFrom(response$);
      console.log(`Get primary account response:`, response);
      return response.data.data.find((acc) => acc.primary);
    } catch (err) {
      throw err.response.data;
    }
  }

  private async getHeaders(userId: Types.ObjectId) {
    return {
      Authorization: `Bearer ${await this.getAccessToken(userId)}`,
    };
  }

  async getAccessToken(userId: Types.ObjectId): Promise<any> {
    const coinbaseAuth = await this.usersService.getCoinbaseAuth(userId);
    if (new Date().getTime() >= coinbaseAuth.expires.getTime()) {
      const response$ = this.refreshAccessToken(coinbaseAuth);
      const response = await lastValueFrom(response$);
      await this.updateUserCoinbaseAuth(response.data, userId);
      return response.data.access_token;
    }
    return this.encryptionService.decryptData(coinbaseAuth.accessToken);
  }

  private refreshAccessToken(CoinbaseAuth: CoinbaseAuth) {
    return this.httpService.post('https://www.coinbase.com/oauth/token', {
      grant_type: 'refresh_token',
      refresh_token: this.encryptionService.decryptData(
        CoinbaseAuth.refreshToken,
      ),
      client_id: this.configService.get<string>('COINBASE_CLIENT_ID'),
      client_secret: this.configService.get<string>('COINBASE_CLIENT_SECRET'),
    });
  }

  private buildAuthorizeUrl(): URL {
    const authorizeUrl = new URL('https://www.coinbase.com/oauth/authorize');
    authorizeUrl.searchParams.append('response_type', 'code');
    authorizeUrl.searchParams.append(
      'client_id',
      this.configService.get<string>('COINBASE_CLIENT_ID'),
    );
    authorizeUrl.searchParams.append(
      'redirect_uri',
      this.configService.get<string>('COINBASE_REDIRECT_URI'),
    );
    authorizeUrl.searchParams.append(
      'scope',
      'wallet:transactions:read,wallet:accounts:read',
    );
    return authorizeUrl;
  }

  private getTokenFromCode(code: string) {
    return this.httpService.post('https://api.coinbase.com/oauth/token', {
      grant_type: 'authorization_code',
      code,
      client_id: this.configService.get<string>('COINBASE_CLIENT_ID'),
      client_secret: this.configService.get<string>('COINBASE_CLIENT_SECRET'),
      redirect_uri: this.configService.get<string>('COINBASE_REDIRECT_URI'),
    });
  }

  private async updateUserCoinbaseAuth(
    tokenPayload: CoinbaseTokenPayload,
    userId: Types.ObjectId,
  ) {
    const {
      access_token: accessToken,
      refresh_token: refreshToken,
      expires_in: expiresIn,
    } = tokenPayload;

    const expires = new Date();
    expires.setSeconds(expires.getSeconds() + expiresIn);
    await this.usersService.updateUser(userId, {
      coinbaseAuth: {
        accessToken,
        refreshToken,
        expires,
      },
    });
  }
}
