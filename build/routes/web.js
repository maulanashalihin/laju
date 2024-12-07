"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const AuthController_1 = __importDefault(require("../app/controllers/AuthController"));
const auth_1 = __importDefault(require("../app/middlewares/auth"));
const HomeController_1 = __importDefault(require("../app/controllers/HomeController"));
const hyper_express_1 = __importDefault(require("hyper-express"));
const Route = new hyper_express_1.default.Router();
Route.get("/", HomeController_1.default.index);
Route.get("/login", AuthController_1.default.loginPage);
Route.post("/login", AuthController_1.default.processLogin);
Route.get("/register", AuthController_1.default.registerPage);
Route.post("/register", AuthController_1.default.processRegister);
Route.post("/logout", AuthController_1.default.logout);
Route.get("/google/redirect", AuthController_1.default.redirect);
Route.get("/google/callback", AuthController_1.default.googleCallback);
Route.get("/forgot-password", AuthController_1.default.forgotPasswordPage);
Route.post("/forgot-password", AuthController_1.default.sendResetPassword);
Route.get("/reset-password/:id", AuthController_1.default.resetPasswordPage);
Route.post("/reset-password", AuthController_1.default.resetPassword);
Route.get("/home", [auth_1.default], AuthController_1.default.homePage);
Route.get("/profile", [auth_1.default], AuthController_1.default.profilePage);
Route.post("/change-profile", [auth_1.default], AuthController_1.default.changeProfile);
Route.post("/change-password", [auth_1.default], AuthController_1.default.changePassword);
Route.delete("/users", [auth_1.default], AuthController_1.default.deleteUsers);
exports.default = Route;
//# sourceMappingURL=web.js.map