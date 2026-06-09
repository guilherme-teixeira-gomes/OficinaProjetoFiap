import { StockMovement } from "../../domain/entities/StockMovement";
import { AppDataSource } from "../database/data-source";

export const StockMovementRepository = AppDataSource.getRepository(StockMovement);