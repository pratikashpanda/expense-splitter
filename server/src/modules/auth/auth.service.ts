import argon2 from "argon2";
import type { User } from "../users/users.types.js";
import type { LoginInput, RegisterInput } from "./auth.schemas.js";
import { userRepository } from "../users/users.repository.js";
import { isUniqueViolation } from "../../db.js";
import { ConflictError, UnauthorizedError } from "../../errors.js";
import { signAccessToken } from "../../lib/jwt.js";

export const authService = {
  async register({ name, email, password }: RegisterInput): Promise<User> {
    const passwordHash = await argon2.hash(password);
    try {
      const id = await userRepository.create({
        name,
        email,
        passwordHash,
      });
      return { id, name, email };
    } catch (err) {
      if (isUniqueViolation(err)) {
        throw new ConflictError("EMAIL_TAKEN", "Email already registered");
      }
      throw err;
    }
  },

  async login({
    email,
    password,
  }: LoginInput): Promise<{ accessToken: string }> {
    const user = await userRepository.findByEmail(email);
    const validUser =
      user && (await argon2.verify(user.passwordHash, password));
    if (!user || !validUser) {
      throw new UnauthorizedError(
        "INVALID_CREDENTIALS",
        "Invalid email or password",
      );
    }
    return { accessToken: signAccessToken(user.id) };
  },
};
