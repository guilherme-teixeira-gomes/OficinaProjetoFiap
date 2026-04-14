// src/entities/StockMovement.ts
import { 
  Entity, 
  PrimaryGeneratedColumn, 
  Column, 
  ManyToOne, 
  CreateDateColumn,
  JoinColumn 
} from "typeorm";
import { Part } from "./Part";
import { ServiceOrder } from "./ServiceOrder";

@Entity("stock_movements")
export class StockMovement {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Part)
  @JoinColumn({ name: "partId" })
  part: Part;

  @Column()
  partId: number;

  @Column({ type: "varchar", length: 100 })
  partName: string;

  @Column({ type: "int" })
  quantity: number;

  @Column({ type: "varchar", length: 10 })
  type: "IN" | "OUT";

  @Column({ type: "decimal", precision: 10, scale: 2 })
  unitPrice: number;

  @Column({ type: "decimal", precision: 10, scale: 2 })
  totalValue: number;

  @ManyToOne(() => ServiceOrder, { nullable: true })
  @JoinColumn({ name: "serviceOrderId" })
  serviceOrder: ServiceOrder | null;

  @Column({ nullable: true })
  serviceOrderId: number;

  @Column({ type: "text", nullable: true })
  description: string;

  @Column({ type: "varchar", length: 50, default: "CONFIRMADO" })
  status: string;

  @CreateDateColumn()
  createdAt: Date;
}