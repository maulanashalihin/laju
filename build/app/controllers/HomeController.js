"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const View_1 = require("../services/View");
class Controller {
    async index(request, response) {
        return response.type("html").send((0, View_1.view)("index.html"));
    }
}
exports.default = new Controller();
//# sourceMappingURL=HomeController.js.map