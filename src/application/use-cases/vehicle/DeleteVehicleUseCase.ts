import { AppDataSource } from "../../../infrastructure/database/data-source";
import { Vehicle } from "../../../domain/entities/Vehicle";

export class DeleteVehicleUseCase {
  async execute(id: number) {
    const repo = AppDataSource.getRepository(Vehicle);

    const vehicle = await repo.findOne({
      where: { id },
      relations: ["serviceOrders"],
    });
    if (!vehicle) throw new Error("Veículo não encontrado");

    // Soft delete — preserva o histórico de OS vinculadas
    await repo.softDelete(id);
    return { message: "Veículo removido com sucesso" };
  }
}