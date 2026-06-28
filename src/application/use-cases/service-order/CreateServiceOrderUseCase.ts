import { AppDataSource } from "../../../infrastructure/database/data-source";
import { ServiceOrder } from "../../../domain/entities/ServiceOrder";
import { Client } from "../../../domain/entities/Client";
import { Vehicle } from "../../../domain/entities/Vehicle";
import { validateDocument, validatePlate } from "../../../shared/helpers/helpers";
import { CreateServiceOrderDTO } from "../../../shared/types/service-order.types";

export class CreateServiceOrderUseCase {
  async create(data: CreateServiceOrderDTO) {
    if (!AppDataSource.isInitialized) await AppDataSource.initialize();
    if (!AppDataSource.isInitialized) await AppDataSource.initialize();
    const orderRepo = AppDataSource.getRepository(ServiceOrder);
    const clientRepo = AppDataSource.getRepository(Client);
    const vehicleRepo = AppDataSource.getRepository(Vehicle);

    if (data.client?.document) {
      data.client.document = validateDocument(data.client.document);
    }
    if (data.vehicle?.plate) {
      data.vehicle.plate = validatePlate(data.vehicle.plate);
    }

    let client = await clientRepo.findOne({
      where: { document: data.client.document },
      relations: ["vehicles"]
    });

    if (!client) {
      if (!data.client.name || !data.client.email || !data.client.phone) {
        throw new Error("Cliente não encontrado. Para criar um novo, é necessário fornecer nome, email e telefone.");
      }
      client = await clientRepo.save({
        name: data.client.name,
        document: data.client.document,
        email: data.client.email,
        phone: data.client.phone
      });
      if (!data.vehicle.plate) throw new Error("Cliente criado. Agora cadastre o veículo.");
      const vehicle = await vehicleRepo.save({
        plate: data.vehicle.plate,
        brand: data.vehicle.brand,
        model: data.vehicle.model,
        year: data.vehicle.year,
        client
      });
      const order = orderRepo.create({ client, vehicle, status: "RECEBIDA", budget: 0, observation: data.observation });
      const savedOrder = await orderRepo.save(order);
      return await orderRepo.findOne({ where: { id: savedOrder.id }, relations: ["client", "vehicle", "services", "parts", "mechanic"] });
    }

    if (data.vehicle.id) {
      const vehicle = await vehicleRepo.findOne({ where: { id: data.vehicle.id, client: { id: client.id } } });
      if (!vehicle) throw new Error("Veículo não encontrado ou não pertence a este cliente");
      const order = orderRepo.create({ client, vehicle, status: "RECEBIDA", budget: 0, observation: data.observation });
      const savedOrder = await orderRepo.save(order);
      return await orderRepo.findOne({ where: { id: savedOrder.id }, relations: ["client", "vehicle", "services", "parts", "mechanic"] });
    }

    else if (data.vehicle.plate) {
      const existingVehicle = await vehicleRepo.findOne({ where: { plate: data.vehicle.plate }, relations: ["client"] });
      if (existingVehicle) {
        if (existingVehicle.client.id === client.id) {
          const order = orderRepo.create({ client, vehicle: existingVehicle, status: "RECEBIDA", budget: 0, observation: data.observation });
          const savedOrder = await orderRepo.save(order);
          return await orderRepo.findOne({ where: { id: savedOrder.id }, relations: ["client", "vehicle", "services", "parts", "mechanic"] });
        } else {
          throw new Error("Este veículo já está cadastrado para outro cliente");
        }
      }
      if (!data.vehicle.brand || !data.vehicle.model || !data.vehicle.year) {
        throw new Error("Para cadastrar um novo veículo, é necessário fornecer marca, modelo e ano");
      }
      const vehicle = await vehicleRepo.save({ plate: data.vehicle.plate, brand: data.vehicle.brand, model: data.vehicle.model, year: data.vehicle.year, client });
      const order = orderRepo.create({ client, vehicle, status: "RECEBIDA", budget: 0, observation: data.observation });
      const savedOrder = await orderRepo.save(order);
      return await orderRepo.findOne({ where: { id: savedOrder.id }, relations: ["client", "vehicle", "services", "parts", "mechanic"] });
    }

    else {
      return {
        success: true,
        message: "Cliente encontrado. Selecione um veículo.",
        data: {
          client: { id: client.id, name: client.name, document: client.document, email: client.email, phone: client.phone },
          vehicles: client.vehicles?.map(v => ({ id: v.id, plate: v.plate, brand: v.brand, model: v.model, year: v.year })) || []
        }
      };
    }
  }
}