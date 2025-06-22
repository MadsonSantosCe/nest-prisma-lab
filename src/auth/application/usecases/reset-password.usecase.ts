import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { OtpRepository } from "src/auth/domain/repositories/otp.repository";
import { UserRepository } from "src/auth/domain/repositories/user.repository";
import { OtpType } from "../../domain/entities/Otp";
import * as bcrypt from "bcryptjs";

@Injectable()
export class ResetPasswordUseCase {
  constructor(
    private otpRepository: OtpRepository,
    private userRepository: UserRepository
  ) {}

  async execute(token: string, password: string) { 

    if (!token) {
      throw new BadRequestException("Token é obrigatório");
    }

    const otp = await this.otpRepository.findValidOtp(
      token,
      OtpType.PASSWORD_RESET
    );

    if (!otp)
      throw new BadRequestException(
        "Código de redefinição de senha inválido ou expirado"
      );

    const user = await this.userRepository.findById(otp.user_id);
    if (!user) throw new NotFoundException("Usuário não encontrado");

    const hashedPassword = await bcrypt.hash(password, 10);
    await this.userRepository.updatePassword(user.id, hashedPassword);
    await this.otpRepository.invalidateOtp(otp.id);

    return true;
  }
}