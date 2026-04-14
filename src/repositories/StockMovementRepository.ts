import { AppDataSource } from "../data-source";
import { StockMovement } from "../entities/StockMovement";


export const StockMovementRepository = AppDataSource.getRepository(StockMovement);