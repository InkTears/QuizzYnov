import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import authRepository from "./auth.repository";
import { isAdminEmail } from "../../utils/role";

class AuthService {

  private resolveRole(user: { email: string; role?: string | null }): "admin" | "user" {
    if ((user.role || "").toLowerCase() === "admin") {
      return "admin";
    }

    return isAdminEmail(user.email) ? "admin" : "user";
  }


async login(email: string, password: string) {

  const user = await authRepository.findByEmail(email);
  if (!user) throw new Error("Identifiants invalides");

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) throw new Error("Identifiants invalides");

  const tokens = this.generateTokens(user.id);
  const hashedRefreshToken = await bcrypt.hash(tokens.refreshToken, 10);
  await authRepository.updateRefreshToken(user.id, hashedRefreshToken);

  return {
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      role: this.resolveRole(user),
    },
    accessToken: tokens.accessToken,
    refreshToken: tokens.refreshToken, 
  };
}

  async register(name: string, email: string, password: string) {
    if (!name || !email || !password) {
      throw new Error("Données invalides");
    }
    const existingUser = await authRepository.findByEmail(email);
    if (existingUser) {
      throw new Error("Email déjà utilisé");
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await authRepository.createUser({
      name,
      email,
      password: hashedPassword,
    });

    return {
      id: user.id,
      email: user.email,
      name: user.name,
      role: this.resolveRole(user),
    };
  }

  async logout(userId: number) {
  await authRepository.updateRefreshToken(userId, null);
}

  async me(userId: number) {
    const user = await authRepository.findById(userId);
    if (!user) {
      throw new Error("Utilisateur introuvable");
    }

    return {
      id: user.id,
      email: user.email,
      name: user.name,
      role: this.resolveRole(user),
    };
  }


  generateTokens(userId: number) {

    const secret = process.env.JWT_SECRET;

    if (!secret) {
      throw new Error("Configuration serveur invalide");
    }
    const accessToken = jwt.sign({ userId }, secret, { expiresIn: "1d" });
    const refreshToken = jwt.sign({ userId }, secret, { expiresIn: "7d" });

    return { accessToken, refreshToken };
  }

  async refresh(refreshToken: string) {

  if (!refreshToken) {
    throw new Error("Token manquant");
  }

  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error("Configuration serveur invalide");
  }

  let decoded: any;

  try {
    decoded = jwt.verify(refreshToken, secret);
  } catch {
    throw new Error("Token invalide");
  }

  const user = await authRepository.findById(decoded.userId);
  if (!user || !user.refreshToken) {
    throw new Error("Token invalide");
  }

  const isMatch = await bcrypt.compare(refreshToken, user.refreshToken);

  if (!isMatch) {
    throw new Error("Token invalide");
  }

  const tokens = this.generateTokens(user.id);

  const hashedRefreshToken = await bcrypt.hash(tokens.refreshToken, 10);

  await authRepository.updateRefreshToken(user.id, hashedRefreshToken);

  return {
    accessToken: tokens.accessToken,
    refreshToken: tokens.refreshToken,
  };
}
}

export default new AuthService();
