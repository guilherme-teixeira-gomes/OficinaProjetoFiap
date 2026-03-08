"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ServiceRepository = void 0;
const data_source_1 = require("../data-source");
const Service_1 = require("../entities/Service");
exports.ServiceRepository = data_source_1.AppDataSource.getRepository(Service_1.Service);
