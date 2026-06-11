import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, ManyToMany, JoinTable } from "typeorm";
import { ServiceOrder } from "./ServiceOrder";
import { Service } from "./Service";
import { Part } from "./Part";

@Entity("diagnostics")
export class Diagnostic {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column("text")
  description: string;

  @Column({ default: false })
  includeInBudget: boolean;

  @Column({ 
    type: "varchar", 
    length: 10, 
    nullable: true,
    default: "media" 
  })
  priority: string;

  @Column("text", { nullable: true })
  mechanicNote: string;

  @ManyToMany(() => Service)
  @JoinTable({ name: "diagnostic_services" })
  recommendedServices: Service[];

  @ManyToMany(() => Part)
  @JoinTable({ name: "diagnostic_parts" })
  recommendedParts: Part[];

  @CreateDateColumn()
  createdAt: Date;

  @ManyToOne(() => ServiceOrder, order => order.diagnostics)
  serviceOrder: ServiceOrder;
}