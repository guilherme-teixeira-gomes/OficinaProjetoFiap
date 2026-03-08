import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Vehicle } from "./Vehicle";
import { ServiceOrder } from "./ServiceOrder";


@Entity("clients")
export class Client {

  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: "varchar", length: 150 })
  name: string;

  @Column({ type: "varchar", length: 18, unique: true })
  document: string; // CPF ou CNPJ

  @Column({ type: "varchar", length: 150 })
  email: string;

  @Column({ type: "varchar", length: 20 })
  phone: string;

  @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  createdAt: Date;

  @OneToMany(() => Vehicle, (vehicle) => vehicle.client)
  vehicles: Vehicle[];

  @OneToMany(() => ServiceOrder, (order) => order.client)
  orders: ServiceOrder[];

}