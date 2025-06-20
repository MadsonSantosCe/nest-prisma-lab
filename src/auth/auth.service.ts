import { UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";

export class AuthService {
  constructor(private readonly jwtService: JwtService) {}

  async verifyToken(token: string): Promise<any> {
    try {
      return this.jwtService.verifyAsync(token);
    } catch (error) {
      if (error instanceof Error && error.name === "TokenExpiredError") {
        throw new UnauthorizedException("Token expirado");
      }

      throw new UnauthorizedException("Token inválido");
    }
  }
}
