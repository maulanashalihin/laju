"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateUUID = generateUUID;
const crypto_1 = require("crypto");
function generateUUID() {
    return (0, crypto_1.randomUUID)();
}
//# sourceMappingURL=helper.js.map