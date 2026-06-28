"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ServiceOrderRepository = exports.getServiceOrderRepository = void 0;
const ServiceOrder_1 = require("../../domain/entities/ServiceOrder");
const data_source_1 = require("../database/data-source");
const getServiceOrderRepository = () => data_source_1.AppDataSource.getRepository(ServiceOrder_1.ServiceOrder);
exports.getServiceOrderRepository = getServiceOrderRepository;
exports.ServiceOrderRepository = new Proxy({}, {
    get(_target, prop) {
        return (0, exports.getServiceOrderRepository)()[prop];
    }
});
