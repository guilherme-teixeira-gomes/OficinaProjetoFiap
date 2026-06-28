"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PartRepository = exports.getPartRepository = void 0;
const Part_1 = require("../../domain/entities/Part");
const data_source_1 = require("../database/data-source");
const getPartRepository = () => data_source_1.AppDataSource.getRepository(Part_1.Part);
exports.getPartRepository = getPartRepository;
exports.PartRepository = new Proxy({}, {
    get(_target, prop) {
        return (0, exports.getPartRepository)()[prop];
    }
});
