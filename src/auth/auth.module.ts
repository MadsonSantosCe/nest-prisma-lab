import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { PrismaModule } from "src/database/prisma.module";
import { PrismaOtpRepository } from "./infrastructure/repositories/PrismaOtpRepository";
import { PrismaUserRepository } from "./infrastructure/repositories/PrismaUserRepository";
import { EmailService } from "./infrastructure/services/EmailService";

@Module({
  imports: [
    PrismaModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: "1d" },
    }),
  ],
  providers: [
    {
      provide: "IUserRepository",
      useClass: PrismaUserRepository,
    },
    {
      provide: "IOtpRepository",
      useClass: PrismaOtpRepository,
    },
    {
      provide: "IEmailService",
      useClass: EmailService,
    },
  ],
})
export class AuthModule {}
