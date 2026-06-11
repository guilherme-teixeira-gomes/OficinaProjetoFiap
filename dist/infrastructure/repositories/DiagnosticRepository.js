"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DiagnosticRepository = void 0;
const Diagnostic_1 = require("../../domain/entities/Diagnostic");
const data_source_1 = require("../database/data-source");
exports.DiagnosticRepository = data_source_1.AppDataSource.getRepository(Diagnostic_1.Diagnostic);
