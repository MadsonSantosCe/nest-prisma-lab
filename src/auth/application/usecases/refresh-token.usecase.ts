import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from "@nestjs/common";
import { UserRepository } from "src/auth/domain/repositories/user.repository";
import { TokenService } from "src/auth/domain/services/token.service";

@Injectable()
export class RefreshTokenUseCase {
  constructor(
    private userRepository: UserRepository,
    private jwtTokenService: TokenService
  ) {}

  async execute(refreshToken: string) {
    if (!refreshToken) {
      throw new UnauthorizedException("Token de atualização ausente");
    }

    const decoded = this.jwtTokenService.verifyToken(refreshToken);

    if (!decoded?.id) {
      throw new UnauthorizedException("Token inválido");
    }

    const user = await this.userRepository.findById(decoded.id);
    if (!user) throw new NotFoundException("Usuário não encontrado");

    const accessToken = this.jwtTokenService.generateToken(user.id, "24h");

    return {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        verified: user.verified,
      },
      accessToken,
    };
  }
}
