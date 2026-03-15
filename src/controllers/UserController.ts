import { Request, Response } from "express";
import { UserService } from "../services/UserService";


export class UserController {
  async handle(req: Request, res: Response) {
    try {
      const user = await UserService.createUser(req.body);
      const { password: _, ...userWithoutPassword } = user;
      res.status(201).json(userWithoutPassword);
    } catch (err: any) {
      res.status(400).json({ message: err.message });
    }
  }

  async login(req: Request, res: Response) {
    try {
      const { email, password } = req.body;
      const result = await UserService.login(email, password);
      res.json(result);
    } catch (err: any) {
      res.status(401).json({ message: err.message });
    }
  }

  async logout(req: Request, res: Response) {
    try {
      const userId = (req as any).user?.id;
      if (!userId) return res.status(400).json({ message: "Usuário não autenticado" });
  
      const result = await UserService.logout(userId);
      res.json(result);
    } catch (err: any) {
      res.status(500).json({ message: err.message });
    }
  }
}