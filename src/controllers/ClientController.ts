import { Request, Response } from "express";
import { ClientService } from "../services/ClientService";


export class ClientController {

  async handle(req: Request, res: Response) {

    try {

      const service = new ClientService();
      const { name, document, email, phone } = req.body;


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


  async list(req: Request, res: Response) {
    const service = new ClientService();
    const clients = await service.list();
    return res.json(clients);
  }

  async get(req: Request, res: Response) {
    const service = new ClientService();
    const client = await service.getById(Number(req.params.id));
    if (!client) return res.status(404).json({ error: "Cliente não encontrado" });
    return res.json(client);

    
  }
  async getDocument(req: Request, res: Response) {
    const service = new ClientService();
    const documentNumber = Array.isArray(req.params.document) 
      ? req.params.document[0] 
      : req.params.document;
    
    const client = await service.getByDocument(documentNumber);
    
    if (!client) {
      return res.status(404).json({ error: "Cliente não encontrado" });
    }
    
    return res.json(client);
  }

}