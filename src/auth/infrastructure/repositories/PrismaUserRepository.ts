import { PrismaClient } from "@prisma/client";
import { IUserRepository } from "../../domain/repositories/IUserRepository";
import { User } from "../../domain/entities/User";
import { NotFoundException } from "@nestjs/common";

export class PrismaUserRepository implements IUserRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async findByEmail(email: string): Promise<User | null> {
    const user = await this.prisma.user.findUnique({ where: { email } });

    if (!user) throw new NotFoundException("Usuário não encontrado");

    return new User(
      user.id,
      user.name,
      user.email,
      user.password,
      user.verified
    );
  }

  async findById(id: string): Promise<User | null> {
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
        updated_at: new Date(),
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

  async updateVerified(id: string, verified: boolean): Promise<User> {
    const updated = await this.prisma.user.update({
      where: { id },
      data: { verified },
    });

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
