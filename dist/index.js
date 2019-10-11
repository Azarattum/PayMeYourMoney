var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "express", "body-parser", "express-session", "dotenv", "./components/app/controllers/router"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    const express_1 = __importDefault(require("express"));
    const body_parser_1 = __importDefault(require("body-parser"));
    const express_session_1 = __importDefault(require("express-session"));
    const dotenv_1 = __importDefault(require("dotenv"));
    const router_1 = __importDefault(require("./components/app/controllers/router"));
    dotenv_1.default.config();
    let app = express_1.default();
    app.locals.basedir = __dirname;
    app.set("views", "./src/components/app/views");
    app.set("view engine", "pug");
    app.use(body_parser_1.default.json());
    app.use(body_parser_1.default.urlencoded({
        extended: true
    }));
    app.use(express_session_1.default({
        secret: process.env.SESSION_SECRET + "",
        resave: false,
        saveUninitialized: false
    }));
    app.use(router_1.default);
    app.listen(80);
});
//# sourceMappingURL=index.js.map