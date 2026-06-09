"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ClientRepository = void 0;
const Client_1 = require("../../domain/entities/Client");
const data_source_1 = require("../database/data-source");
exports.ClientRepository = data_source_1.AppDataSource.getRepository(Client_1.Client);
