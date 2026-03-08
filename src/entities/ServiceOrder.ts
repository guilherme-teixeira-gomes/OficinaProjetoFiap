import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, ManyToMany, JoinTable } from "typeorm";
import { Client } from "./Client";
import { Vehicle } from "./Vehicle";
import { Service } from "./Service";
import { Part } from "./Part";

@Entity("service_orders")
export class ServiceOrder {

  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Client, (client) => client.orders)
  client: Client;

  @ManyToOne(() => Vehicle, (vehicle) => vehicle.orders)
  vehicle: Vehicle;

  @ManyToMany(() => Service)
  @JoinTable()
  services: Service[];

  @ManyToMany(() => Part)
  @JoinTable()
  parts: Part[];

  @Column({ type: "varchar", length: 50, default: "Recebida" })
  status: string;

  @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  createdAt: Date;
}