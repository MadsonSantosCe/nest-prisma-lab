import {
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import { Response } from 'express';
import { UserRepository } from "src/auth/domain/repositories/user.repository";
import { TokenService } from "src/auth/domain/services/token.service";
import * as bcrypt from "bcryptjs";

@Injectable()
export class SignInUseCase {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly jwtTokenService: TokenService
  ) {}

  async execute(email: string, password: string, res: Response) {
    const user = await this.userRepository.findByEmail(email);

    if (!user || !(await bcrypt.compare(password, user.password))) {
      throw new UnauthorizedException("E-mail ou senha inválidos");
    }

    if (!user.verified) {
      throw new ForbiddenException("E-mail não verificado");
    }

    const accessToken = this.jwtTokenService.generateToken(user.id, "24h");
    const refreshToken = this.jwtTokenService.generateToken(user.id, "7d");

    this.jwtTokenService.setRefreshTokenCookie(refreshToken, res);

    return {
      user: user,
      accessToken,
    };
  }
}
