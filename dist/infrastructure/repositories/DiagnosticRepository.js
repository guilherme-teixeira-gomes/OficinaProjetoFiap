"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DiagnosticRepository = exports.getDiagnosticRepository = void 0;
const Diagnostic_1 = require("../../domain/entities/Diagnostic");
const data_source_1 = require("../database/data-source");
const getDiagnosticRepository = () => data_source_1.AppDataSource.getRepository(Diagnostic_1.Diagnostic);
exports.getDiagnosticRepository = getDiagnosticRepository;
exports.DiagnosticRepository = new Proxy({}, {
    get(_target, prop) {
        return (0, exports.getDiagnosticRepository)()[prop];
    }
});
