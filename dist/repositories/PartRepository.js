"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PartRepository = void 0;
const data_source_1 = require("../data-source");
const Part_1 = require("../entities/Part");
exports.PartRepository = data_source_1.AppDataSource.getRepository(Part_1.Part);
