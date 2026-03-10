import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, ManyToMany, JoinTable, OneToMany, JoinColumn } from "typeorm";
import { Client } from "./Client";
import { Vehicle } from "./Vehicle";
import { Service } from "./Service";
import { Part } from "./Part";
import { Diagnostic } from "./Diagnostic";
import { User } from "./User";

@Entity("service_orders")
export class ServiceOrder {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Client, (client) => client.orders)
  client: Client;

  @ManyToOne(() => Vehicle, (vehicle) => vehicle.orders)
  vehicle: Vehicle;

  @ManyToOne(() => User)
  @JoinColumn({ name: "mechanicId" })
  mechanic: User;

  @Column({ type: "int", nullable: true })
  mechanicId: number;

  @ManyToMany(() => Service)
  @JoinTable({ name: "service_orders_services" })
  services: Service[];

  @ManyToMany(() => Part)
  @JoinTable({ name: "service_orders_parts" })
  parts: Part[];

  @OneToMany(() => Diagnostic, (diagnostic) => diagnostic.serviceOrder)
  diagnostics: Diagnostic[];

  @Column({ type: "boolean", default: false })
  approved: boolean;

  @Column({ type: "decimal", precision: 10, scale: 2, default: 0 })
  budget: number;

  @Column({ type: "timestamp", nullable: true })
  approvedAt: Date;

  @Column({ type: "varchar", length: 50, default: "RECEBIDA" })
  status: string;

  @Column("text", { nullable: true })
  observation: string; 

  @Column({ type: "timestamp", nullable: true })
  startedAt: Date;

  @Column({ type: "timestamp", nullable: true })
  finishedAt: Date;

  @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  createdAt: Date;
}