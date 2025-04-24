"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const View_1 = require("../services/View");
let pkg = { version: "1.0.0" };
const inertia = () => {
    return (req, res, next) => {
        res.inertia = async (component, inertiaProps = {}, viewProps = {}) => {
            const url = `//${req.get("host")}${req.originalUrl}`;
            let props = { user: req.user || {}, ...inertiaProps, ...viewProps, error: null };
            if (req.cookies.error) {
                props.error = req.cookies.error;
                res
                    .cookie("error", "", 0);
            }
            const inertiaObject = {
                component: component,
                props: props,
                url: url,
                version: pkg.version,
            };
            if (!req.header("X-Inertia")) {
                const html = await (0, View_1.view)("inertia.html", {
                    page: JSON.stringify(inertiaObject),
                    title: process.env.TITLE || "LAJU - Ship Your Next Project Faster",
                });
                return res.type("html").send(html);
            }
            res.setHeader("Vary", "Accept");
            res.setHeader("X-Inertia", "true");
            res.setHeader("X-Inertia-Version", pkg.version);
            return res.json(inertiaObject);
        };
        next();
    };
};
exports.default = inertia;
//# sourceMappingURL=inertia.js.map