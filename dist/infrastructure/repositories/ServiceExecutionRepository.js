"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ServiceExecutionRepository = void 0;
const ServiceExecution_1 = require("../../domain/entities/ServiceExecution");
const data_source_1 = require("../database/data-source");
exports.ServiceExecutionRepository = data_source_1.AppDataSource.getRepository(ServiceExecution_1.ServiceExecution);
