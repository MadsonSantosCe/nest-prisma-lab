import { Injectable, Inject, ConflictException } from "@nestjs/common";
import { IUserRepository } from "src/auth/domain/interfaces/IUserRepository";
import { OtpType } from "../../domain/entities/Otp";
import { IOtpRepository } from "src/auth/domain/interfaces/IOtpRepository";
import { IEmailService } from "src/auth/domain/interfaces/IEmailService";
import * as bcrypt from "bcryptjs";

@Injectable()
export class SignUpUseCase {
  constructor(
    @Inject("IUserRepository") private userRepository: IUserRepository,
    @Inject("IOtpRepository") private otpRepository: IOtpRepository,
    @Inject("IEmailService") private emailService: IEmailService
  ) {}

  async execute({
    name,
    email,
    password,
  }: {
    name: string;
    email: string;
    password: string;
  }) {
    const existingUser = await this.userRepository.findByEmail(email);

    if (existingUser) {
      throw new ConflictException("O e-mail já está em uso");
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await this.userRepository.create({
      name,
      email,
      password: hashedPassword,
    });

    const verification_code = Math.floor(
      100000 + Math.random() * 900000
    ).toString();

    await this.otpRepository.create({
      code: verification_code,
      type: OtpType.EMAIL_VERIFICATION,
      user_id: newUser.id,
      expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000),
    });

    await this.emailService.sendVerificationEmail(
      newUser.email,
      verification_code
    );

    return {
      id: newUser.id,
      name: newUser.name,
      email: newUser.email,
      verified: newUser.verified,
    };
  }
}
