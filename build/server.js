"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const inertia_1 = __importDefault(require("./app/middlewares/inertia"));
const web_1 = __importDefault(require("./routes/web"));
const hyper_express_1 = __importDefault(require("hyper-express"));
const cors_1 = __importDefault(require("cors"));
const webserver = new hyper_express_1.default.Server();
require("dotenv").config();
require("./app/services/View");
webserver.use((0, cors_1.default)());
webserver.use((0, inertia_1.default)());
webserver.use(web_1.default);
const PORT = parseInt(process.env.PORT) || 5555;
webserver.set_error_handler((req, res, error) => {
    console.log(error);
    if (error.code == "SQLITE_ERROR") {
        res.status(500);
    }
    res.json(error);
});
webserver
    .listen(PORT)
    .then(() => {
    console.log(`Server is running at http://localhost:${PORT}`);
})
    .catch((err) => { });
process.on("SIGTERM", () => {
    console.info("SIGTERM signal received.");
    process.exit(0);
});
//# sourceMappingURL=server.js.map