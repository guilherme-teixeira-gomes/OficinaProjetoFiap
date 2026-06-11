"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ServiceRepository = void 0;
const Service_1 = require("../../domain/entities/Service");
const data_source_1 = require("../database/data-source");
exports.ServiceRepository = data_source_1.AppDataSource.getRepository(Service_1.Service);
