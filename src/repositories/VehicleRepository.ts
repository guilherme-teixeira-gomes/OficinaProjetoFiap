import { AppDataSource } from "../data-source";
import { Vehicle } from "../entities/Vehicle";

export const VehicleRepository = AppDataSource.getRepository(Vehicle);