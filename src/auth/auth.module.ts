import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { PrismaModule } from "src/database/prisma.module";

import { PrismaUserRepository } from "./infrastructure/repositories/prisma.user.repository";
import { PrismaOtpRepository } from "./infrastructure/repositories/prisma.otp.repository";
import { EmailService } from "./infrastructure/services/email.service";
import { SignUpUseCase } from "./application/usecases/sign-up.usecase";
import { AuthController } from "./presentation/auth.controller";

import { UserRepository } from "./domain/contracts/user.repository";
import { OtpRepository } from "./domain/contracts/otp.repository";
import { EmailContract } from "./domain/contracts/email.contract";
import { JwtTokenService } from "./infrastructure/services/jwt.token.service";
import { TokenContract } from "./domain/contracts/token.contract";

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
    EmailService,
    JwtTokenService,
    SignUpUseCase,
    {
      provide: UserRepository,
      useClass: PrismaUserRepository,
    },
    {
      provide: OtpRepository,
      useClass: PrismaOtpRepository,
    },
    {
      provide: EmailContract,
      useClass: EmailService,
    },
    {
      provide: TokenContract,
      useClass: JwtTokenService,
    },
  ],
  controllers: [AuthController],
})
export class AuthModule {}
