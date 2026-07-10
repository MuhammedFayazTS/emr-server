import { AuthRepository } from "@/modules/auth/auth.repository";

export class AuthService {
  constructor(private repository: AuthRepository) {}

  register() {
    return this.repository.create();
  }
}