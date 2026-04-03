import { Request, Response } from "express";
import authService from "./auth.service";

class AuthController {
  async register(req: Request, res: Response) {
    try {
      const user = await authService.register(req.body);
      res.status(201).json(user);
    } catch (e: any) {
      res.status(400).json({ message: e.message });
    }
  }

  async login(req: Request, res: Response) {
    try {
      const { email, password } = req.body;
      const result = await authService.login(email, password);
      res.json(result);
    } catch (e: any) {
      res.status(401).json({ message: e.message });
    }
  }

  async refresh(req: Request, res: Response) {
    try {
      const { refreshToken } = req.body;
      const tokens = await authService.refresh(refreshToken);
      res.json(tokens);
    } catch (e: any) {
      res.status(401).json({ message: "Session expirée" });
    }
  }
}

export default new AuthController();