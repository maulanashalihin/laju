"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const knexfile_1 = __importDefault(require("../../knexfile"));
require("dotenv").config();
const knex_1 = __importDefault(require("knex"));
let DB = (0, knex_1.default)(knexfile_1.default[process.env.DB_CONNECTION]);
DB.connection = (stage) => {
    return (0, knex_1.default)(knexfile_1.default[stage]);
};
exports.default = DB;
//# sourceMappingURL=DB.js.map