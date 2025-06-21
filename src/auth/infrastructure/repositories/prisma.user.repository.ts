import { Injectable, NotFoundException } from "@nestjs/common";
import { UserRepository } from "../../domain/contracts/user.repository";
import { User } from "../../domain/entities/User";
import { PrismaService } from "src/database/prisma.service";

@Injectable()
export class PrismaUserRepository implements UserRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findByEmail(email: string): Promise<User | null> {
    const user = await this.prisma.user.findUnique({ where: { email } });

    if (!user) return null;

    return new User(
      user.id,
      user.name,
      user.email,
      user.password,
      user.verified
    );
  }

  async findById(id: string): Promise<User> {
    const user = await this.prisma.user.findUnique({ where: { id } });

    if (!user) throw new NotFoundException("Usuário não encontrado");

    return new User(
      user.id,
      user.name,
      user.email,
      user.password,
      user.verified
    );
  }

  async create(user: {
    name: string;
    email: string;
    password: string;
  }): Promise<User> {
    const newUser = await this.prisma.user.create({
      data: {
        name: user.name,
        email: user.email,
        password: user.password,
      },
    });

    return new User(
      newUser.id,
      newUser.name,
      newUser.email,
      newUser.password,
      newUser.verified
    );
  }

  async updateVerified(id: string, verified: boolean): Promise<User | null> {
    const updated = await this.prisma.user.update({
      where: { id },
      data: { verified },
    });

    if (!updated) return null;

    return new User(
      updated.id,
      updated.name,
      updated.email,
      updated.password,
      updated.verified
    );
  }

  async updatePassword(id: string, password: string): Promise<void> {
    await this.prisma.user.update({ where: { id }, data: { password } });
  }
}
