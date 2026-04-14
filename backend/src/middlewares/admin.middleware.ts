import { NextFunction, Request, Response } from "express";
import { AppDataSource } from "../data-source";
import { User } from "../entity/User";
import { isAdminEmail } from "../utils/role";

export const adminMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  const userId = (req as any).userId;

  if (typeof userId !== "number" || userId <= 0) {
    res.status(401).json({ message: "Utilisateur non authentifie" });
    return;
  }

  const user = await AppDataSource.getRepository(User).findOne({
    where: { id: userId },
    select: ["id", "email", "role"],
  });

  const isAdmin = !!user && ((user.role || "").toLowerCase() === "admin" || isAdminEmail(user.email));

  if (!isAdmin) {
    res.status(403).json({ message: "Acces reserve aux administrateurs" });
    return;
  }

  next();
};

