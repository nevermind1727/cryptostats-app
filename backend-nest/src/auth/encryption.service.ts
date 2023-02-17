import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as crypto from 'crypto';

@Injectable()
export class EncryptionService {
  private readonly algorithm: string = 'aes256';
  constructor(private readonly configService: ConfigService) {}

  encryptData(data: string): string {
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv(
      this.algorithm,
      this.configService.get<string>('ENCRYPTION_KEY'),
      iv,
    );
    let encryptedData = cipher.update(data, 'utf-8', 'hex');
    encryptedData += cipher.final('hex');
    return encryptedData;
  }

  decryptData(encryptedData: string): string {
    const iv = crypto.randomBytes(16);
    const decipher = crypto.createDecipheriv(
      this.algorithm,
      this.configService.get<string>('ENCRYPTION_KEY'),
      iv,
    );
    let decryptedData = decipher.update(encryptedData, 'hex', 'utf-8');
    decryptedData += decipher.final('utf8');
    return decryptedData;
  }
}
