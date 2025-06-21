import { Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { TokenService } from "../../domain/services/token.service";
import { Response } from "express";

@Injectable()
export class JwtTokenService implements TokenService {
  constructor(private readonly jwtService: JwtService) {}

  generateToken(userId: string, expiresIn: string) {
    const token = this.jwtService.sign(
      { id: userId },
      { expiresIn: expiresIn }
    );
    return token;
  }

  verifyToken(token: string): { id: string } {
    try {
      return this.jwtService.verify(token, { secret: process.env.JWT_SECRET });
    } catch {
      throw new UnauthorizedException("Invalid refresh token");
    }
  }

  setRefreshTokenCookie(token: string, res: Response): void {
    res.cookie("refreshToken", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
  }
}
