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
exports.Diagnostic = void 0;
const typeorm_1 = require("typeorm");
const ServiceOrder_1 = require("./ServiceOrder");
const Service_1 = require("./Service");
const Part_1 = require("./Part");
let Diagnostic = class Diagnostic {
};
exports.Diagnostic = Diagnostic;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], Diagnostic.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Diagnostic.prototype, "title", void 0);
__decorate([
    (0, typeorm_1.Column)("text"),
    __metadata("design:type", String)
], Diagnostic.prototype, "description", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: false }),
    __metadata("design:type", Boolean)
], Diagnostic.prototype, "includeInBudget", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: "varchar",
        length: 10,
        nullable: true,
        default: "media"
    }),
    __metadata("design:type", String)
], Diagnostic.prototype, "priority", void 0);
__decorate([
    (0, typeorm_1.Column)("text", { nullable: true }),
    __metadata("design:type", String)
], Diagnostic.prototype, "mechanicNote", void 0);
__decorate([
    (0, typeorm_1.ManyToMany)(() => Service_1.Service),
    (0, typeorm_1.JoinTable)({ name: "diagnostic_services" }),
    __metadata("design:type", Array)
], Diagnostic.prototype, "recommendedServices", void 0);
__decorate([
    (0, typeorm_1.ManyToMany)(() => Part_1.Part),
    (0, typeorm_1.JoinTable)({ name: "diagnostic_parts" }),
    __metadata("design:type", Array)
], Diagnostic.prototype, "recommendedParts", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], Diagnostic.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => ServiceOrder_1.ServiceOrder, order => order.diagnostics),
    __metadata("design:type", ServiceOrder_1.ServiceOrder)
], Diagnostic.prototype, "serviceOrder", void 0);
exports.Diagnostic = Diagnostic = __decorate([
    (0, typeorm_1.Entity)("diagnostics")
], Diagnostic);
