import { Request, Response } from "express";
import authService from "./auth.service";

class AuthController {
  async register(req: Request, res: Response) {
    try {
      const { name, email, password } = req.body;

      const user = await authService.register(name, email, password);

      return res.status(201).json(user);
    } catch (e: any) {
      return res.status(400).json({ error: e.message });
    }
  }

  async login(req: Request, res: Response) {
    try {
      const { email, password } = req.body;

      const result = await authService.login(email, password);

      console.log("COOKIE SENT:", result.refreshToken);

      res.cookie("refreshToken", result.refreshToken, {
        httpOnly: true,
        secure: false,
        sameSite: "lax",
      });

      return res.json({
        user: result.user,
        accessToken: result.accessToken,
        refreshToken: result.refreshToken,
      });
    } catch (e: any) {
      return res.status(401).json({ error: e.message });
    }
  }

  async refresh(req: Request, res: Response) {
    try {
      const { refreshToken } = req.body;

      if (!refreshToken) {
        return res.status(401).json({ error: "Token manquant" });
      }

      const tokens = await authService.refresh(refreshToken);

      return res.json({
        accessToken: tokens.accessToken,
      });
    } catch (e: any) {
      return res.status(401).json({ error: e.message });
    }
  }

  async logout(req: Request, res: Response) {
    try {
      const userId = (req as any).userId;

      await authService.logout(userId);

      res.clearCookie("refreshToken");

      return res.json({ message: "Déconnexion réussie" });
    } catch (e: any) {
      return res.status(500).json({ error: e.message });
    }
  }

  async me(req: Request, res: Response) {
    try {
      const userId = (req as any).userId;

      if (typeof userId !== "number" || userId <= 0) {
        return res.status(401).json({ error: "Utilisateur non authentifie" });
      }

      const user = await authService.me(userId);
      return res.json({ user });
    } catch (e: any) {
      return res.status(401).json({ error: e.message });
    }
  }
}

export default new AuthController();
