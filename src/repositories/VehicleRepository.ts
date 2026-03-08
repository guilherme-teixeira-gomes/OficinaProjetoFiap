import { AppDataSource } from "../data-source";
import { Vehicle } from "../entities/Vehicle";



const VehicleRepository = AppDataSource.getRepository(Vehicle);