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
    (0, typeorm_1.ManyToMany)(() => Service_1.Service),
    (0, typeorm_1.JoinTable)({
        name: "service_order_services", // Nome claro para a tabela de junção
        joinColumn: {
            name: "service_order_id",
            referencedColumnName: "id"
        },
        inverseJoinColumn: {
            name: "service_id",
            referencedColumnName: "id"
        }
    }),
    __metadata("design:type", Array)
], ServiceOrder.prototype, "services", void 0);
__decorate([
    (0, typeorm_1.ManyToMany)(() => Part_1.Part),
    (0, typeorm_1.JoinTable)({
        name: "service_order_parts", // Nome claro para a tabela de junção
        joinColumn: {
            name: "service_order_id",
            referencedColumnName: "id"
        },
        inverseJoinColumn: {
            name: "part_id",
            referencedColumnName: "id"
        }
    }),
    __metadata("design:type", Array)
], ServiceOrder.prototype, "parts", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "varchar", length: 50, default: "RECEBIDA" }),
    __metadata("design:type", String)
], ServiceOrder.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" }),
    __metadata("design:type", Date)
], ServiceOrder.prototype, "createdAt", void 0);
exports.ServiceOrder = ServiceOrder = __decorate([
    (0, typeorm_1.Entity)("service_orders")
], ServiceOrder);
