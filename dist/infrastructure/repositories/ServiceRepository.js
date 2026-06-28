"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ServiceRepository = exports.getServiceRepository = void 0;
const Service_1 = require("../../domain/entities/Service");
const data_source_1 = require("../database/data-source");
const getServiceRepository = () => data_source_1.AppDataSource.getRepository(Service_1.Service);
exports.getServiceRepository = getServiceRepository;
exports.ServiceRepository = new Proxy({}, {
    get(_target, prop) {
        return (0, exports.getServiceRepository)()[prop];
    }
});
