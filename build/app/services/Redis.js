"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const redis_1 = require("redis");
let client;
(async () => {
    client = (0, redis_1.createClient)();
    client.on('error', (err) => console.log('Redis Client Error', err));
    await client.connect();
})();
exports.default = client;
//# sourceMappingURL=Redis.js.map