import { Router, Request, Response } from "express";
import authController from "./auth.controller";
import { authMiddleware } from "../../middlewares/auth.middleware";

const router = Router();

router.post("/register", (req: Request, res: Response) =>
  authController.register(req, res)
);

router.post("/login", (req: Request, res: Response) =>
  authController.login(req, res)
);

router.post("/refresh", (req: Request, res: Response) =>
  authController.refresh(req, res)
);

router.post("/logout", authMiddleware, (req: Request, res: Response) =>
  authController.logout(req, res)
);

router.get("/me", authMiddleware, (req: Request, res: Response) =>
  authController.me(req, res)
);

export const authRouter = router;