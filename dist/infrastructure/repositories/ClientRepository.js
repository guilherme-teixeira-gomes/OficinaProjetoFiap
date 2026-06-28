"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ClientRepository = exports.getClientRepository = void 0;
const Client_1 = require("../../domain/entities/Client");
const data_source_1 = require("../database/data-source");
const getClientRepository = () => data_source_1.AppDataSource.getRepository(Client_1.Client);
exports.getClientRepository = getClientRepository;
exports.ClientRepository = new Proxy({}, {
    get(_target, prop) {
        return (0, exports.getClientRepository)()[prop];
    }
});
