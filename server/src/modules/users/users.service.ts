import { NotFoundError } from "../../errors.js";
import { userRepository } from "./users.repository.js";
import type { User } from "./users.types.js";

export const usersService = {
  async getById(id: number): Promise<User> {
    const user = await userRepository.findById(id);
    if (!user) throw new NotFoundError("User Not Found");
    return user;
  },
};
