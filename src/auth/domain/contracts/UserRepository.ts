import { User } from "../entities/User";

export abstract class UserRepository {
  abstract findByEmail(email: string): Promise<User | null>;
  abstract findById(id: string): Promise<User>;
  abstract create(user: Omit<User, "id" | "verified"> & { password: string }): Promise<User>;
  abstract updateVerified(id: string, verified: boolean): Promise<User | null>;
  abstract updatePassword(id: string, password: string): Promise<void>;
}
