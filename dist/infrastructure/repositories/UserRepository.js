"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserRepository = void 0;
const User_1 = require("../../domain/entities/User");
const data_source_1 = require("../database/data-source");
exports.UserRepository = data_source_1.AppDataSource.getRepository(User_1.User);
