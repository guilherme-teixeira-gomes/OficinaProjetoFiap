"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ServiceOrderRepository = void 0;
const data_source_1 = require("../data-source");
const ServiceOrder_1 = require("../entities/ServiceOrder");
exports.ServiceOrderRepository = data_source_1.AppDataSource.getRepository(ServiceOrder_1.ServiceOrder);
