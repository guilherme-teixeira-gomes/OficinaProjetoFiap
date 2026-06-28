"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserRepository = exports.getUserRepository = void 0;
const User_1 = require("../../domain/entities/User");
const data_source_1 = require("../database/data-source");
const getUserRepository = () => data_source_1.AppDataSource.getRepository(User_1.User);
exports.getUserRepository = getUserRepository;
exports.UserRepository = new Proxy({}, {
    get(_target, prop) {
        return (0, exports.getUserRepository)()[prop];
    }
});
