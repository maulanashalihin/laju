"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const View_1 = require("../services/View");
let pkg = { version: "1.0.0" };
const inertia = () => {
    return (request, response, next) => {
        response.inertia = async (component, inertiaProps = {}, viewProps = {}) => {
            const url = `//${request.get("host")}${request.originalUrl}`;
            let props = { user: request.user || {}, ...inertiaProps, ...viewProps, error: null };
            if (request.cookies.error) {
                props.error = request.cookies.error;
                response
                    .cookie("error", "", 0);
            }
            const inertiaObject = {
                component: component,
                props: props,
                url: url,
                version: pkg.version,
            };
            if (!request.header("X-Inertia")) {
                const html = await (0, View_1.view)("inertia.html", {
                    page: JSON.stringify(inertiaObject),
                    title: process.env.TITLE || "LAJU - Ship Your Next Project Faster",
                });
                return response.type("html").send(html);
            }
            response.setHeader("Vary", "Accept");
            response.setHeader("X-Inertia", "true");
            response.setHeader("X-Inertia-Version", pkg.version);
            return response.json(inertiaObject);
        };
        next();
    };
};
exports.default = inertia;
//# sourceMappingURL=inertia.js.map