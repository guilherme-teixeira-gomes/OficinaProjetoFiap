import { StockMovement } from "../../domain/entities/StockMovement";
import { AppDataSource } from "../database/data-source";

export const getStockMovementRepository = () => AppDataSource.getRepository(StockMovement);
export const StockMovementRepository = new Proxy({} as ReturnType<typeof getStockMovementRepository>, {
  get(_target, prop) {
    return getStockMovementRepository()[prop as keyof ReturnType<typeof getStockMovementRepository>];
  }
});
