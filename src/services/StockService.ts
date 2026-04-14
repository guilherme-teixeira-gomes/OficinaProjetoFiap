// src/services/StockService.ts
import { Repository, LessThan } from "typeorm";
import { AppDataSource } from "../data-source";
import { Part } from "../entities/Part";
import { StockMovement } from "../entities/StockMovement";
import { ServiceOrder } from "../entities/ServiceOrder";
import { PartRepository } from "../repositories/PartRepository";
import { StockMovementRepository } from "../repositories/StockMovementRepository";

export class StockService {



  async checkStockAvailability(partId: number, requiredQuantity: number): Promise<{
    available: boolean;
    currentStock: number;
    requiredQuantity: number;
    deficit?: number;
  }> {
    const part = await PartRepository.findOne({ where: { id: partId } });
    
    if (!part) {
      throw new Error(`Peça com ID ${partId} não encontrada`);
    }

    const available = part.stock >= requiredQuantity;
    
    return {
      available,
      currentStock: part.stock,
      requiredQuantity,
      deficit: available ? undefined : requiredQuantity - part.stock
    };
  }

  async reserveStock(
    partId: number, 
    quantity: number, 
    serviceOrderId: number,
    description?: string
  ): Promise<StockMovement> {
    const part = await PartRepository.findOne({ where: { id: partId } });
    
    if (!part) {
      throw new Error(`Peça com ID ${partId} não encontrada`);
    }

    if (part.stock < quantity) {
      throw new Error(
        `Estoque insuficiente para ${part.name}. ` +
        `Disponível: ${part.stock}, ` +
        `Solicitado: ${quantity}`
      );
    }

    // Atualiza o estoque
    part.stock -= quantity;
    await PartRepository.save(part);

    // Cria o registro de movimentação
    const movement = StockMovementRepository.create({
      partId: part.id,
      partName: part.name,
      quantity: -quantity,
      type: "OUT",
      unitPrice: part.price,
      totalValue: part.price * quantity,
      serviceOrderId: serviceOrderId,
      description: description || `Baixa de ${quantity} unidade(s) para OS #${serviceOrderId}`,
      status: "CONFIRMADO"
    });

    await StockMovementRepository.save(movement);

    return movement;
  }

  async restoreStock(
    partId: number, 
    quantity: number, 
    serviceOrderId: number,
    description?: string
  ): Promise<StockMovement> {
    const part = await PartRepository.findOne({ where: { id: partId } });
    
    if (!part) {
      throw new Error(`Peça com ID ${partId} não encontrada`);
    }

    // Restaura o estoque
    part.stock += quantity;
    await PartRepository.save(part);

    // Cria o registro de movimentação
    const movement = StockMovementRepository.create({
      partId: part.id,
      partName: part.name,
      quantity: quantity,
      type: "IN",
      unitPrice: part.price,
      totalValue: part.price * quantity,
      serviceOrderId: serviceOrderId,
      description: description || `Estorno de ${quantity} unidade(s) da OS #${serviceOrderId}`,
      status: "CONFIRMADO"
    });

    await StockMovementRepository.save(movement);

    return movement;
  }

  async addStock(
    partId: number, 
    quantity: number, 
    description?: string
  ): Promise<StockMovement> {
    const part = await PartRepository.findOne({ where: { id: partId } });
    
    if (!part) {
      throw new Error(`Peça com ID ${partId} não encontrada`);
    }

    // Atualiza o estoque
    part.stock += quantity;
    await PartRepository.save(part);

    // Cria o registro de movimentação
    const movement = StockMovementRepository.create({
      partId: part.id,
      partName: part.name,
      quantity: quantity,
      type: "IN",
      unitPrice: part.price,
      totalValue: part.price * quantity,
      serviceOrderId: null,
      description: description || `Entrada de ${quantity} unidade(s) no estoque`,
      status: "CONFIRMADO"
    });

    await StockMovementRepository.save(movement);

    return movement;
  }

  async getLowStock(): Promise<Part[]> {
    return await PartRepository.find({
      where: {
        stock: LessThan(5) // Alerta quando estoque menor que 5
      },
      order: {
        stock: "ASC"
      }
    });
  }

  async getCriticalStock(): Promise<Part[]> {
    return await PartRepository
      .createQueryBuilder("part")
      .where("part.stock <= part.minimumStock")
      .orderBy("part.stock", "ASC")
      .getMany();
  }

  async getStockMovements(filters?: {
    partId?: number;
    serviceOrderId?: number;
    startDate?: Date;
    endDate?: Date;
    type?: "IN" | "OUT";
  }): Promise<StockMovement[]> {
    const query = StockMovementRepository
      .createQueryBuilder("movement")
      .leftJoinAndSelect("movement.part", "part")
      .leftJoinAndSelect("movement.serviceOrder", "serviceOrder")
      .orderBy("movement.createdAt", "DESC");

    if (filters?.partId) {
      query.andWhere("movement.partId = :partId", { partId: filters.partId });
    }

    if (filters?.serviceOrderId) {
      query.andWhere("movement.serviceOrderId = :serviceOrderId", { 
        serviceOrderId: filters.serviceOrderId 
      });
    }

    if (filters?.startDate) {
      query.andWhere("movement.createdAt >= :startDate", { startDate: filters.startDate });
    }

    if (filters?.endDate) {
      query.andWhere("movement.createdAt <= :endDate", { endDate: filters.endDate });
    }

    if (filters?.type) {
      query.andWhere("movement.type = :type", { type: filters.type });
    }

    return await query.getMany();
  }

  async getStockSummary(): Promise<{
    totalParts: number;
    totalValue: number;
    lowStockCount: number;
    criticalStockCount: number;
    partsByStock: Array<{
      name: string;
      stock: number;
      minimumStock: number;
      status: string;
    }>;
  }> {
    const parts = await PartRepository.find();
    const lowStock = await this.getLowStock();
    const criticalStock = await this.getCriticalStock();

    const totalValue = parts.reduce((sum, part) => sum + (part.price * part.stock), 0);

    return {
      totalParts: parts.length,
      totalValue: totalValue,
      lowStockCount: lowStock.length,
      criticalStockCount: criticalStock.length,
      partsByStock: parts.map(part => ({
        name: part.name,
        stock: part.stock,
        minimumStock: part.minimumStock,
        status: part.stock <= part.minimumStock 
          ? "CRÍTICO" 
          : part.stock < 10 
            ? "BAIXO" 
            : "NORMAL"
      }))
    };
  }

  async validateStockForServiceOrder(serviceOrder: ServiceOrder): Promise<{
    valid: boolean;
    errors: Array<{
      partId: number;
      partName: string;
      required: number;
      available: number;
    }>;
  }> {
    const errors = [];

    for (const part of serviceOrder.parts) {
      const availability = await this.checkStockAvailability(part.id, 1);
      
      if (!availability.available) {
        errors.push({
          partId: part.id,
          partName: part.name,
          required: 1,
          available: availability.currentStock
        });
      }
    }

    return {
      valid: errors.length === 0,
      errors
    };
  }
}