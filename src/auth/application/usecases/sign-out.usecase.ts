import { Injectable } from "@nestjs/common";
import { TokenService } from "src/auth/domain/services/token.service";
import { Response } from "express";

@Injectable()
export class SignOutUseCase {
  constructor(private readonly JwtTokenService: TokenService) {}

  execute(res: Response) {
    this.JwtTokenService.clearRefreshTokenCookie(res);
  }
}
