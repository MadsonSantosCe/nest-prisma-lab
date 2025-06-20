import { Module } from "@nestjs/common";
import { PassportModule } from "@nestjs/passport";
import { PrismaModule } from "src/database/prisma.module";
import { UserController } from "./controllers/user.controller";
import { UserService } from "./services/user.service";
import { AuthModule } from "src/auth/auth.module";

@Module({
  imports: [PrismaModule, AuthModule],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}
