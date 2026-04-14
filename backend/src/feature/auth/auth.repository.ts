import { AppDataSource } from "../../data-source";
import { User } from "../../entity/User";
import { Repository } from "typeorm";

class AuthRepository {
  private get repo(): Repository<User> {
    return AppDataSource.getRepository(User);
  }

async findByEmail(email: string): Promise<User | null> {
  return await this.repo.findOne({
    where: { email },
    select: ["id", "email", "password", "name", "refreshToken"]
  });
}

  async findById(id: number): Promise<User | null> {
    return await this.repo.findOneBy({ id });
  }

  async createUser(userData: Partial<User>): Promise<User> {
    const user = this.repo.create(userData);
    return await this.repo.save(user);
  }

  async updateRefreshToken(userId: number, token: string | null): Promise<void> {
    await this.repo.update(userId, { refreshToken: token });
  }
}

export default new AuthRepository();