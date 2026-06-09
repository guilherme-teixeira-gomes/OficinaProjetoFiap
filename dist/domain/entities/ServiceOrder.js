"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ServiceOrder = void 0;
const typeorm_1 = require("typeorm");
const Client_1 = require("./Client");
const Vehicle_1 = require("./Vehicle");
const Service_1 = require("./Service");
const Part_1 = require("./Part");
const Diagnostic_1 = require("./Diagnostic");
const User_1 = require("./User");
const ServiceExecution_1 = require("./ServiceExecution");
let ServiceOrder = class ServiceOrder {
};
exports.ServiceOrder = ServiceOrder;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], ServiceOrder.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => Client_1.Client, (client) => client.orders),
    __metadata("design:type", Client_1.Client)
], ServiceOrder.prototype, "client", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => Vehicle_1.Vehicle, (vehicle) => vehicle.orders),
    __metadata("design:type", Vehicle_1.Vehicle)
], ServiceOrder.prototype, "vehicle", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => User_1.User),
    (0, typeorm_1.JoinColumn)({ name: "mechanicId" }),
    __metadata("design:type", User_1.User)
], ServiceOrder.prototype, "mechanic", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "int", nullable: true }),
    __metadata("design:type", Number)
], ServiceOrder.prototype, "mechanicId", void 0);
__decorate([
    (0, typeorm_1.ManyToMany)(() => Service_1.Service),
    (0, typeorm_1.JoinTable)({ name: "service_orders_services" }),
    __metadata("design:type", Array)
], ServiceOrder.prototype, "services", void 0);
__decorate([
    (0, typeorm_1.ManyToMany)(() => Part_1.Part),
    (0, typeorm_1.JoinTable)({ name: "service_orders_parts" }),
    __metadata("design:type", Array)
], ServiceOrder.prototype, "parts", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => Diagnostic_1.Diagnostic, (diagnostic) => diagnostic.serviceOrder),
    __metadata("design:type", Array)
], ServiceOrder.prototype, "diagnostics", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => ServiceExecution_1.ServiceExecution, execution => execution.serviceOrder),
    __metadata("design:type", Array)
], ServiceOrder.prototype, "executions", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "boolean", default: false }),
    __metadata("design:type", Boolean)
], ServiceOrder.prototype, "approved", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "decimal", precision: 10, scale: 2, default: 0 }),
    __metadata("design:type", Number)
], ServiceOrder.prototype, "budget", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "timestamp", nullable: true }),
    __metadata("design:type", Date)
], ServiceOrder.prototype, "approvedAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "varchar", length: 50, default: "RECEBIDA" }),
    __metadata("design:type", String)
], ServiceOrder.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)("text", { nullable: true }),
    __metadata("design:type", String)
], ServiceOrder.prototype, "observation", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "timestamp", nullable: true }),
    __metadata("design:type", Date)
], ServiceOrder.prototype, "startedAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "timestamp", nullable: true }),
    __metadata("design:type", Date)
], ServiceOrder.prototype, "finishedAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" }),
    __metadata("design:type", Date)
], ServiceOrder.prototype, "createdAt", void 0);
exports.ServiceOrder = ServiceOrder = __decorate([
    (0, typeorm_1.Entity)("service_orders")
], ServiceOrder);
