import { Response } from 'express';

export abstract class TokenService {
  abstract generateToken(userId: string, expiresIn: string): string ;
  abstract verifyToken(token: string): { id: string };
  abstract setRefreshTokenCookie(token: string, res: Response): void;
}
