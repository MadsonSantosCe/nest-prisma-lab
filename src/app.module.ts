import { Module } from "@nestjs/common";
import { UserModule } from "./user/user.module";
import { PrismaModule } from "./database/prisma.module";
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [PrismaModule, AuthModule, UserModule, AuthModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
