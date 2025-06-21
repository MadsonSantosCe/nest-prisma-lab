import { Controller, Post, Req } from "@nestjs/common";
import { SignUpUseCase } from "../application/usecases/SignUpUseCase";

@Controller("auth")
export class AuthController {
  constructor(private readonly signUpUseCase: SignUpUseCase) {}

  @Post("sign-up")
  async signUp(@Req() req) {
    const { name, email, password } = req.body;
    return await this.signUpUseCase.execute({ name, email, password });
  }
}
