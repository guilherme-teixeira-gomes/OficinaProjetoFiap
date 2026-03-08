import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Vehicle } from "./Vehicle";
import { Client } from "./Client";

@Entity("service_orders")
export class ServiceOrder {

  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: "enum",
    enum: [
      "RECEBIDA",
      "EM_DIAGNOSTICO",
      "AGUARDANDO_APROVACAO",
      "EM_EXECUCAO",
      "FINALIZADA",
      "ENTREGUE"
    ],
    default: "RECEBIDA"
  })
  status: string;

  @Column({ type: "decimal", precision: 10, scale: 2, default: 0 })
  total: number;

  @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  createdAt: Date;

  @ManyToOne(() => Client, (client) => client.orders)
  client: Client;

  @ManyToOne(() => Vehicle)
  vehicle: Vehicle;

}