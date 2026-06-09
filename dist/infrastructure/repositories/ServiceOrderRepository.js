"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ServiceOrderRepository = void 0;
const ServiceOrder_1 = require("../../domain/entities/ServiceOrder");
const data_source_1 = require("../database/data-source");
exports.ServiceOrderRepository = data_source_1.AppDataSource.getRepository(ServiceOrder_1.ServiceOrder);
