import { Vehicle } from "../../domain/entities/Vehicle";
import { AppDataSource } from "../database/data-source";

export const getVehicleRepository = () => AppDataSource.getRepository(Vehicle);
export const VehicleRepository = new Proxy({} as ReturnType<typeof getVehicleRepository>, {
  get(_target, prop) {
    return getVehicleRepository()[prop as keyof ReturnType<typeof getVehicleRepository>];
  }
});
