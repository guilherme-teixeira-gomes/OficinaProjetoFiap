import { Vehicle } from "../../domain/entities/Vehicle";
import { AppDataSource } from "../database/data-source";

export const VehicleRepository = AppDataSource.getRepository(Vehicle);