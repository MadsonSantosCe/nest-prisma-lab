import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { PrismaModule } from "src/database/prisma.module";
import { PrismaOtpRepository } from "./infrastructure/repositories/PrismaOtpRepository";
import { PrismaUserRepository } from "./infrastructure/repositories/PrismaUserRepository";
import { IEmailService } from "./domain/repositories/IEmailService";
import { EmailService } from "./infrastructure/services/EmailService";
import { SignUpUseCase } from "./application/usecases/SignUpUseCase";
import { AuthController } from "./presentation/AuthController";
import { UserRepository } from "./domain/repositories/UserRepository";
import { OtpRepository } from "./domain/repositories/OtpRepository";

@Module({
  imports: [
    PrismaModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: "1d" },
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
      provide: IEmailService,
      useClass: EmailService,
    },
  ],
  controllers: [AuthController],
})
export class AuthModule {}
