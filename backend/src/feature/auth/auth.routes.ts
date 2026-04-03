import { Router, Request, Response } from "express";
import authController from "./auth.controller";

const router = Router();

router.post("/register", (req: Request, res: Response) => authController.register(req, res));
router.post("/login", (req: Request, res: Response) => authController.login(req, res));
router.post("/refresh", (req: Request, res: Response) => authController.refresh(req, res));

export const authRouter = router;