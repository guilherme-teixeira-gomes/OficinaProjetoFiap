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
exports.ServiceExecution = void 0;
const typeorm_1 = require("typeorm");
const ServiceOrder_1 = require("./ServiceOrder");
const Service_1 = require("./Service");
let ServiceExecution = class ServiceExecution {
};
exports.ServiceExecution = ServiceExecution;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], ServiceExecution.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => ServiceOrder_1.ServiceOrder),
    (0, typeorm_1.JoinColumn)({ name: "serviceOrderId" }),
    __metadata("design:type", ServiceOrder_1.ServiceOrder)
], ServiceExecution.prototype, "serviceOrder", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], ServiceExecution.prototype, "serviceOrderId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => Service_1.Service),
    (0, typeorm_1.JoinColumn)({ name: "serviceId" }),
    __metadata("design:type", Service_1.Service)
], ServiceExecution.prototype, "service", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], ServiceExecution.prototype, "serviceId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "timestamp", nullable: true }),
    __metadata("design:type", Date)
], ServiceExecution.prototype, "startedAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "timestamp", nullable: true }),
    __metadata("design:type", Date)
], ServiceExecution.prototype, "finishedAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "int", nullable: true }),
    __metadata("design:type", Number)
], ServiceExecution.prototype, "durationMinutes", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "varchar", length: 50, default: "PENDENTE" }),
    __metadata("design:type", String)
], ServiceExecution.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)("text", { nullable: true }),
    __metadata("design:type", String)
], ServiceExecution.prototype, "mechanicNote", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" }),
    __metadata("design:type", Date)
], ServiceExecution.prototype, "createdAt", void 0);
exports.ServiceExecution = ServiceExecution = __decorate([
    (0, typeorm_1.Entity)("service_executions")
], ServiceExecution);
