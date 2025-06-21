import { Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { TokenContract } from "../../domain/contracts/token.contract";
import { Response } from "express";

@Injectable()
export class JwtTokenService implements TokenContract {
  constructor(private readonly jwtService: JwtService) {}

  generateTokens(userId: string) {
    const accessToken = this.jwtService.sign(
      { id: userId },
      { expiresIn: "15m" }
    );
    const refreshToken = this.jwtService.sign(
      { id: userId },
      { expiresIn: "7d" }
    );
    return { accessToken, refreshToken };
  }

  verifyRefreshToken(token: string): { id: string } {
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
