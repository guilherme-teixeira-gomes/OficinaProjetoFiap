import { ClientRepository } from "../repositories/ClientRepository";




interface CreateClientDTO {
  name: string;
  document: string;
  email: string;
  phone: string;
}

export class CreateClientService {

  async execute(data: CreateClientDTO) {

    const exists = await ClientRepository.findOne({
      where: { document: data.document }
    });

    if (exists) {
      throw new Error("Cliente já cadastrado");
    }

    const client = ClientRepository.create(data);

    await ClientRepository.save(client);

    return client;
  }

}