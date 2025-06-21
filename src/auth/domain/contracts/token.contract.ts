import { Response } from 'express';

export abstract class TokenContract {
  abstract generateTokens(userId: string): { accessToken: string; refreshToken: string };
  abstract verifyRefreshToken(token: string): { id: string };
  abstract setRefreshTokenCookie(token: string, res: Response): void;
}
