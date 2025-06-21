import { Controller, HttpCode, Post, Req, Res } from "@nestjs/common";
import { Response } from "express";
import { SignUpUseCase } from "../application/usecases/sign-up.usecase";
import { SignInUseCase } from "../application/usecases/sign-in.usecase";
import { VerifyEmailUseCase } from "../application/usecases/verify-email.usecase";

@Controller("auth")
export class AuthController {
  constructor(
    private readonly signUpUseCase: SignUpUseCase,
    private readonly signInUseCase: SignInUseCase,
    private readonly verifyEmailUseCase: VerifyEmailUseCase
  ) {}

  @Post("sign-up")
  @HttpCode(201)
  async signUp(@Req() req) {
    const { name, email, password } = req.body;
    return await this.signUpUseCase.execute(name, email, password);
  }

  @Post("sign-in")
  @HttpCode(200)
  async signIn(@Req() req, @Res({ passthrough: true }) res: Response) {
    const { email, password } = req.body;
    return await this.signInUseCase.execute(email, password, res);
  }

  @Post("verify-email")
  @HttpCode(200)
  async verifyEmail(@Req() req, @Res({ passthrough: true }) res: Response) {
    const { code } = req.body;
    return await this.verifyEmailUseCase.execute(code, res);
  }
}
