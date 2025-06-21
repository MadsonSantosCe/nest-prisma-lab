import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { PrismaModule } from "src/database/prisma.module";

import { PrismaUserRepository } from "./infrastructure/repositories/PrismaUserRepository";
import { PrismaOtpRepository } from "./infrastructure/repositories/PrismaOtpRepository";
import { EmailService } from "./infrastructure/services/EmailService";
import { SignUpUseCase } from "./application/usecases/SignUpUseCase";
import { AuthController } from "./presentation/AuthController";

import { UserRepository } from "./domain/contracts/UserRepository";
import { OtpRepository } from "./domain/contracts/OtpRepository";
import { EmailContract } from "./domain/contracts/EmailContract";

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
  ],
  controllers: [AuthController],
})
export class AuthModule {}
