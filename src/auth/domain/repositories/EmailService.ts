export abstract class EmailService {
  abstract sendVerificationEmail(email: string, code: string): Promise<void>;
  abstract sendPasswordResetEmail(email: string, link: string): Promise<void>;
}
