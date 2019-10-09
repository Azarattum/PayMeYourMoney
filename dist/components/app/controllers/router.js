var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "express", "../views/register", "../views/error", "../models/user.class", "../views/status", "../views/profile"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    const express_1 = __importDefault(require("express"));
    const register_1 = __importDefault(require("../views/register"));
    const error_1 = __importDefault(require("../views/error"));
    const user_class_1 = __importDefault(require("../models/user.class"));
    const status_1 = __importDefault(require("../views/status"));
    const profile_1 = __importDefault(require("../views/profile"));
    let router = express_1.default.Router();
    router.get('/register', function (request, response) {
        const session = request.session;
        if (!session)
            throw "Session is not initialized!";
        initSession(session);
        if (session.loggedId != -1) {
            response.redirect("/profile");
        }
        let view = new register_1.default();
        view.render(response);
    });
    router.post('/register', function (request, response) {
        const session = request.session;
        if (!session)
            throw "Session is not initialized!";
        initSession(session);
        let users = session.users;
        let { name, password } = request.body;
        if (!name.match(/[-_a-zA-Z0-9]+/) ||
            !password.match(/[-_a-zA-Z0-9]+/)) {
            new status_1.default("Wrong format!", "Try to follow the rules instead of hacking website.")
                .render(response);
            return;
        }
        let user = users.find(x => x.username == name);
        if (user) {
            if (!user_class_1.default.checkPassword(user, password)) {
                new status_1.default("Invalid password! Or taken name!", "Enter a valid password or a different name if you try to register.")
                    .render(response);
                return;
            }
        }
        else {
            user = new user_class_1.default(name, password);
            users.push(user);
        }
        session.loggedId = users.indexOf(user);
        response.redirect("/profile");
    });
    router.post("/logout", function (request, response) {
        const session = request.session;
        if (!session)
            throw "Session is not initialized!";
        initSession(session);
        session.loggedId = -1;
        response.redirect("/register");
    });
    router.get("/profile", function (request, response) {
        const session = request.session;
        if (!session)
            throw "Session is not initialized!";
        initSession(session);
        if (session.loggedId == -1) {
            response.redirect("/register");
            return;
        }
        const user = session.users[session.loggedId];
        let view = new profile_1.default(user);
        view.render(response);
    });
    router.get("/", function (request, response) {
        const session = request.session;
        if (!session)
            throw "Session is not initialized!";
        initSession(session);
        if (session.loggedId == -1) {
            response.redirect("/register");
        }
        else {
            response.redirect("/profile");
        }
    });
    router.get("*", function (request, response) {
        new error_1.default(404).render(response);
    });
    function initSession(session) {
        if (!session.users) {
            session.users = [];
        }
        if (session.loggedId == undefined) {
            session.loggedId = -1;
        }
    }
    exports.default = router;
});
//# sourceMappingURL=router.js.map