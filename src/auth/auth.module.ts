import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { PrismaModule } from "src/database/prisma.module";

import { PrismaUserRepository } from "./infrastructure/repositories/prisma.user.repository";
import { PrismaOtpRepository } from "./infrastructure/repositories/prisma.otp.repository";
import { NodemailerEmailService } from "./infrastructure/services/nodemailer.email.service";
import { JwtTokenService } from "./infrastructure/services/jwt.token.service";

import { UserRepository } from "./domain/repositories/user.repository";
import { OtpRepository } from "./domain/repositories/otp.repository";
import { EmailService } from "./domain/services/email.service";
import { TokenService } from "./domain/services/token.service";

import { AuthController } from "./presentation/auth.controller";
import { SignUpUseCase } from "./application/usecases/sign-up.usecase";
import { SignInUseCase } from "./application/usecases/sign-in.usecase";
import { VerifyEmailUseCase } from "./application/usecases/verify-email.usecase";
import { SignOutUseCase } from "./application/usecases/sign-out.usecase";
import { ForgotPasswordUseCase } from "./application/usecases/forgot-password.usecase";

@Module({
  imports: [
    PrismaModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET,
    }),
  ],
  providers: [
    PrismaUserRepository,
    PrismaOtpRepository,
    NodemailerEmailService,
    JwtTokenService,
    SignUpUseCase,
    SignInUseCase,
    VerifyEmailUseCase,
    SignOutUseCase,
    ForgotPasswordUseCase,
    {
      provide: UserRepository,
      useClass: PrismaUserRepository,
    },
    {
      provide: OtpRepository,
      useClass: PrismaOtpRepository,
    },
    {
      provide: EmailService,
      useClass: NodemailerEmailService,
    },
    {
      provide: TokenService,
      useClass: JwtTokenService,
    },
  ],
  controllers: [AuthController],
})
export class AuthModule {}
