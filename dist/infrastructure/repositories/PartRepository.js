"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PartRepository = void 0;
const Part_1 = require("../../domain/entities/Part");
const data_source_1 = require("../database/data-source");
exports.PartRepository = data_source_1.AppDataSource.getRepository(Part_1.Part);
