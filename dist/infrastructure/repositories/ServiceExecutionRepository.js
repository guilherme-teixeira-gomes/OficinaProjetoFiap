"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ServiceExecutionRepository = exports.getServiceExecutionRepository = void 0;
const ServiceExecution_1 = require("../../domain/entities/ServiceExecution");
const data_source_1 = require("../database/data-source");
const getServiceExecutionRepository = () => data_source_1.AppDataSource.getRepository(ServiceExecution_1.ServiceExecution);
exports.getServiceExecutionRepository = getServiceExecutionRepository;
exports.ServiceExecutionRepository = new Proxy({}, {
    get(_target, prop) {
        return (0, exports.getServiceExecutionRepository)()[prop];
    }
});
