import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Client } from "./Client";



@Entity("vehicles")
export class Vehicle {

  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: "varchar", length: 10, unique: true })
  plate: string;

  @Column()
  brand: string;

  @Column()
  model: string;

  @Column()
  year: number;

  @ManyToOne(() => Client, (client) => client.vehicles)
  client: Client;

}