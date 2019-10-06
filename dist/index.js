var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "express", "body-parser", "./components/app/views/error", "./components/app/views/register"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    const express_1 = __importDefault(require("express"));
    const body_parser_1 = __importDefault(require("body-parser"));
    const error_1 = __importDefault(require("./components/app/views/error"));
    const register_1 = __importDefault(require("./components/app/views/register"));
    let app = express_1.default();
    let router = express_1.default.Router();
    app.use(body_parser_1.default.json());
    app.use(body_parser_1.default.urlencoded({
        extended: true
    }));
    app.locals.basedir = __dirname;
    app.set("views", "./src/components/app/views");
    app.set("view engine", "pug");
    router.get('/register', function (request, response) {
        let view = new register_1.default();
        view.render(response);
    });
    router.get("/", function (request, response) {
        response.redirect("/register");
    });
    router.get("*", function (request, response) {
        new error_1.default(404).render(response);
    });
    app.use(router);
    app.listen(80);
});
//# sourceMappingURL=index.js.map