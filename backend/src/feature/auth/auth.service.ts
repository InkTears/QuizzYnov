import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import authRepository from "./auth.repository";
import { User } from "../../entity/User";

class AuthService {
  async register(userData: Partial<User>) {
    const existing = await authRepository.findByEmail(userData.email!);
    if (existing) throw new Error("Email déjà utilisé");

    const hashedPassword = await bcrypt.hash(userData.password!, 10);
    const user = await authRepository.createUser({ ...userData, password: hashedPassword });
    
    const { password, refreshToken, ...userSafe } = user;
    return userSafe;
  }

  async login(email: string, password: string) {
    const user = await authRepository.findByEmail(email);
    if (!user) throw new Error("Identifiants invalides");

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) throw new Error("Identifiants invalides");

    const tokens = this.generateTokens(user.id);
    await authRepository.updateRefreshToken(user.id, tokens.refreshToken);
    
    return {
      user: { id: user.id, email: user.email, username: (user as any).username },
      ...tokens
    };
  }

  private generateTokens(userId: number) {
    const accessToken = jwt.sign({ id: userId }, process.env.ACCESS_TOKEN_SECRET!, { expiresIn: "15m" });
    const refreshToken = jwt.sign({ id: userId }, process.env.REFRESH_TOKEN_SECRET!, { expiresIn: "7d" });
    return { accessToken, refreshToken };
  }

  async refresh(token: string) {
    const payload = jwt.verify(token, process.env.REFRESH_TOKEN_SECRET!) as { id: number };
    const user = await authRepository.findById(payload.id);
    
    if (!user || user.refreshToken !== token) throw new Error("Token invalide");

    const tokens = this.generateTokens(user.id);
    await authRepository.updateRefreshToken(user.id, tokens.refreshToken);
    return tokens;
  }
}

export default new AuthService();