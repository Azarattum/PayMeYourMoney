var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "express", "../views/register", "../views/error", "../models/user.class", "../views/status", "../views/profile", "../views/transaction", "../views/confirmation", "path", "crypto", "../views/store", "fs"], factory);
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
    const transaction_1 = __importDefault(require("../views/transaction"));
    const confirmation_1 = __importDefault(require("../views/confirmation"));
    const path_1 = __importDefault(require("path"));
    const crypto_1 = __importDefault(require("crypto"));
    const store_1 = __importDefault(require("../views/store"));
    const fs_1 = __importDefault(require("fs"));
    let router = express_1.default.Router();
    router.get("/store", function (request, response) {
        const session = request.session;
        if (!session)
            throw "Session is not initialized!";
        initSession(session);
        let view;
        if (session.loggedId != -1) {
            const user = session.users[session.loggedId];
            view = new store_1.default(user);
        }
        else {
            view = new store_1.default();
        }
        view.render(response);
    });
    router.post("/buy", function (request, response) {
        const cost = 9999999;
        const session = request.session;
        if (!session)
            throw "Session is not initialized!";
        initSession(session);
        if (session.loggedId == -1) {
            response.redirect("/register");
            return;
        }
        const { from } = request.body;
        const user = session.users[session.loggedId];
        const card = user.cards.find(x => x.id == +from);
        if (!card) {
            new status_1.default("You do not have this card!", "Try to transfer money from the card YOU have.")
                .render(response);
            return;
        }
        if (card.balance >= cost) {
            card.balance -= cost;
            card.transactions++;
            new status_1.default("You did it!", `Enjoy your flag: ${process.env.FLAG}.`)
                .render(response);
        }
        else {
            new status_1.default("WE NEED MORE GOLD!", "Not enough money to buy the flag.")
                .render(response);
        }
    });
    router.get("/register", function (request, response) {
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
    router.post("/register", function (request, response) {
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
            if (users.length > 16) {
                new status_1.default("Registration refused!", "You have too many accounts per one person.")
                    .render(response);
                return;
            }
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
    router.post("/transfer", function (request, response) {
        const session = request.session;
        if (!session)
            throw "Session is not initialized!";
        initSession(session);
        if (session.loggedId == -1) {
            response.redirect("/register");
            return;
        }
        let { from } = request.body;
        const user = session.users[session.loggedId];
        const card = user.cards.find(x => x.id == from);
        if (!card) {
            new status_1.default("You do not have this card!", "Try to transfer money from the card YOU have.")
                .render(response);
            return;
        }
        new transaction_1.default(card).render(response);
    });
    router.post("/confirm", function (request, response) {
        const session = request.session;
        if (!session)
            throw "Session is not initialized!";
        initSession(session);
        if (session.loggedId == -1) {
            response.redirect("/register");
            return;
        }
        let { from, to, amount } = request.body;
        const user = session.users[session.loggedId];
        const card = user.cards.find(x => x.id == from);
        if (!card) {
            new status_1.default("You do not have this card!", "Try to transfer money from the card YOU have.")
                .render(response);
            return;
        }
        let cards = [];
        session.users.map(x => {
            cards.push(...x.cards);
        });
        const reciever = cards.find(x => x.id == to);
        if (!reciever) {
            new status_1.default("Unexisting card!", "Sorry, but the card you specified does not exist...")
                .render(response);
            return;
        }
        if (amount > card.balance) {
            new status_1.default("Not enough money!", "Sorry, but you can not give more than you have...")
                .render(response);
            return;
        }
        if (amount <= 0) {
            new status_1.default("It does not make any sense!", "You can not pay nothing or less!")
                .render(response);
            return;
        }
        if (card.id == reciever.id) {
            new status_1.default("Same card!", "What is the point in transfering money to the same card?")
                .render(response);
            return;
        }
        new confirmation_1.default(card, reciever, amount).render(response);
    });
    router.post("/addcard", function (request, response) {
        const session = request.session;
        if (!session)
            throw "Session is not initialized!";
        initSession(session);
        if (session.loggedId == -1) {
            response.redirect("/register");
            return;
        }
        let { name = "Untitled Card" } = request.body;
        const user = session.users[session.loggedId];
        user_class_1.default.addCard(user, name);
        response.redirect("/profile");
    });
    router.post("/pay", function (request, response) {
        const session = request.session;
        if (!session)
            throw "Session is not initialized!";
        initSession(session);
        if (session.loggedId == -1) {
            response.redirect("/register");
            return;
        }
        const { from, to, amount, validation } = request.body;
        const user = session.users[session.loggedId];
        const card = user.cards.find(x => x.id == +from);
        if (!card) {
            new status_1.default("You do not have this card!", "Try to transfer money from the card YOU have.")
                .render(response);
            return;
        }
        let cards = [];
        session.users.map(x => {
            cards.push(...x.cards);
        });
        const reciever = cards.find(x => x.id == to);
        const hasher = crypto_1.default.createHash("sha256");
        const hash = hasher.update((+from + +to).toString() + to.toString() + card.transactions +
            amount + "7h15_15_7h3_50l71357_50l7_y0u_h4v3_3v3r_533n!").digest("hex");
        if (reciever && validation == hash) {
            card.balance -= +amount;
            card.transactions++;
            reciever.balance += +amount;
            new status_1.default("Success!", `You successfuly transfered ${amount}\u20BF.`)
                .render(response);
        }
        else {
            new status_1.default("Invalid operation!", "Detected an attempt to compromise transaction.")
                .render(response);
        }
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
        if (path_1.default.extname(request.url)) {
            const bannedExtetions = [".html", ".js", ".css", ".map"];
            if (!bannedExtetions.some(x => request.url.indexOf(x) != -1)) {
                const path = path_1.default.resolve(path_1.default.join(__dirname, "../../..", request.url));
                if (request.url.indexOf("..") != -1) {
                    new error_1.default(403).render(response);
                }
                if (fs_1.default.existsSync(path)) {
                    const data = fs_1.default.readFileSync(path);
                    response.write(data);
                    response.end();
                }
                else {
                    new error_1.default(404).render(response);
                }
            }
            else {
                new error_1.default(403).render(response);
            }
        }
        else {
            response.redirect("/");
        }
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