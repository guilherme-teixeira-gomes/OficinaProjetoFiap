
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from "typeorm";
import { ServiceOrder } from "./ServiceOrder";
import { Service } from "./Service";

@Entity("service_executions")
export class ServiceExecution {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => ServiceOrder)
  @JoinColumn({ name: "serviceOrderId" })
  serviceOrder: ServiceOrder;

  @Column()
  serviceOrderId: number;

  @ManyToOne(() => Service)
  @JoinColumn({ name: "serviceId" })
  service: Service;

  @Column()
  serviceId: number;

  @Column({ type: "timestamp", nullable: true })
  startedAt: Date;

  @Column({ type: "timestamp", nullable: true })
  finishedAt: Date;

  @Column({ type: "int", nullable: true })
  durationMinutes: number; 

  @Column({ type: "varchar", length: 50, default: "PENDENTE" })
  status: string;

  @Column("text", { nullable: true })
  mechanicNote: string;

  @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  createdAt: Date;
}