import { Request, Response } from "express";
import { CreateClientService } from "../services/CreateClientService";

export class CreateClientController {

  async handle(req: Request, res: Response) {

    try {

      const { name, document, email, phone } = req.body;

      const service = new CreateClientService();

      const client = await service.execute({
        name,
        document,
        email,
        phone
      });

      return res.status(201).json(client);

    } catch (error: any) {

      return res.status(400).json({
        error: error.message
      });

    }

  }

}