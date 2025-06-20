import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { Request } from 'express';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const authHeader = request.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedException('Token não informado');
    }

    const token = authHeader.split(' ')[1];

    if (!token) {
      throw new UnauthorizedException('Token não informado');
    }
    
    try {
      const payload = this.jwtService.verifyAsync(token)
      request['user'] = payload;
      return true;
    } catch (error) {

      if (error instanceof Error && error.name === "TokenExpiredError") {
        throw new UnauthorizedException("Token expirado");
      }

      throw new UnauthorizedException('Token inválido');
    }
  }
}
