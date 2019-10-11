import Express from "express";
import RegisterView from "../views/register";
import ErrorView from "../views/error";
import User from "../models/user.class";
import StatusView from "../views/status";
import ProfileView from "../views/profile";
import TransactionView from "../views/transaction";
import Card from "../models/card.class";
import ConfirmationView from "../views/confirmation";
import Path from "path";
import Crypto from "crypto";
import StoreView from "../views/store";
import FileSystem from "fs";

let router = Express.Router()

router.get("/store", function (request, response) {
    const session = request.session;
    if (!session) throw "Session is not initialized!";
    initSession(session);

    let view: StoreView;
    if (session.loggedId != -1) {
        const user = session.users[session.loggedId];
        view = new StoreView(user);
        console.log("GET /store as " + user.username);
    } else {
        view = new StoreView();
        console.log("GET /store (nouser)");
    }

    view.render(response);
});

router.post("/buy", function (request, response) {
    const cost = 9999999;
    const session = request.session;
    if (!session) throw "Session is not initialized!";
    initSession(session);

    if (session.loggedId == -1) {
        response.redirect("/register");
        return;
    }

    const { from }: { from: string } = request.body;

    const user = session.users[session.loggedId] as User;
    const card = user.cards.find(x => x.id == +from);
    console.log(`POST /buy as ${user.username} [from: ${from}]`);

    if (!card) {
        console.log(`\t${user.username} ← Wrong card`);
        new StatusView("You do not have this card!", "Try to transfer money from the card YOU have.")
            .render(response);
        return;
    }

    if (card.balance >= cost) {
        console.log(`\t${user.username} ← FLAG`);
        card.balance -= cost;
        card.transactions++;
        new StatusView("You did it!", `Enjoy your flag: ${process.env.FLAG}.`)
            .render(response);
    } else {
        console.log(`\t${user.username} ← Not enough money`);
        new StatusView("WE NEED MORE GOLD!", "Not enough money to buy the flag.")
            .render(response);
    }
});

router.get("/register", function (request, response) {
    const session = request.session;
    if (!session) throw "Session is not initialized!";
    initSession(session);

    if (session.loggedId != -1) {
        response.redirect("/profile");
    }

    console.log(`GET /register`);
    let view = new RegisterView();
    view.render(response);
});

router.post("/register", function (request, response) {
    const session = request.session;
    if (!session) throw "Session is not initialized!";
    initSession(session);

    let users: User[] = session.users;
    let { name, password } = request.body;

    console.log(`POST /register [name: ${name}, pass: ${password}]`);

    if (!(<string>name).match(/[-_a-zA-Z0-9]+/) ||
        !(<string>password).match(/[-_a-zA-Z0-9]+/)) {
        console.log(`\t${name} ← Wrong format`);
        new StatusView("Wrong format!", "Try to follow the rules instead of hacking website.")
            .render(response);
        return;
    }

    let user = users.find(x => x.username == name) as User;
    if (user) {
        if (!User.checkPassword(user, password)) {
            console.log(`\t${user.username} ← Invalid password`);
            new StatusView("Invalid password! Or taken name!",
                "Enter a valid password or a different name if you try to register.")
                .render(response);
            return;
        }
        console.log(`\t${user.username} ← Logged in`);
    }
    else {
        if (users.length > 16) {
            console.log(`\t${name} ← Too many registrations`);
            new StatusView("Registration refused!",
                "You have too many accounts per one person.")
                .render(response);
            return;
        }
        user = new User(name, password);
        users.push(user);
    }

    session.loggedId = users.indexOf(user);
    response.redirect("/profile");
});

router.post("/logout", function (request, response) {
    const session = request.session;
    if (!session) throw "Session is not initialized!";
    initSession(session);

    console.log(`POST /logout as ${session.users[session.loggedId].username}`);
    session.loggedId = -1;

    response.redirect("/register");
});

router.get("/profile", function (request, response) {
    const session = request.session;
    if (!session) throw "Session is not initialized!";
    initSession(session);

    if (session.loggedId == -1) {
        response.redirect("/register");
        return;
    }

    const user = session.users[session.loggedId];
    console.log(`GET /profile as ${user.username}`);
    let view = new ProfileView(user);
    view.render(response);
});

router.post("/transfer", function (request, response) {
    const session = request.session;
    if (!session) throw "Session is not initialized!";
    initSession(session);

    if (session.loggedId == -1) {
        response.redirect("/register");
        return;
    }

    let { from } = request.body;

    const user = session.users[session.loggedId] as User;
    const card = user.cards.find(x => x.id == from);

    console.log(`POST /transfer as ${user.username} [from: ${from}]`);

    if (!card) {
        console.log(`\t${user.username} ← Wrong card`);
        new StatusView("You do not have this card!", "Try to transfer money from the card YOU have.")
            .render(response);
        return;
    }

    new TransactionView(card).render(response);
});

router.post("/confirm", function (request, response) {
    const session = request.session;
    if (!session) throw "Session is not initialized!";
    initSession(session);

    if (session.loggedId == -1) {
        response.redirect("/register");
        return;
    }

    let { from, to, amount } = request.body;

    const user = session.users[session.loggedId] as User;
    const card = user.cards.find(x => x.id == from);
    console.log(`POST /confirm as ${user.username} [from: ${from}, to: ${to}, amount: ${amount}]`);

    if (!card) {
        console.log(`\t${user.username} ← Wrong card`);
        new StatusView("You do not have this card!", "Try to transfer money from the card YOU have.")
            .render(response);
        return;
    }

    let cards: Card[] = [];
    (session.users as User[]).map(x => {
        cards.push(...x.cards);
    });
    const reciever = cards.find(x => x.id == to);

    if (!reciever) {
        console.log(`\t${user.username} ← Unexisting card`);
        new StatusView("Unexisting card!", "Sorry, but the card you specified does not exist...")
            .render(response);
        return;
    }

    if (+amount > card.balance) {
        console.log(`\t${user.username} ← Not enough money`);
        new StatusView("Not enough money!", "Sorry, but you can not give more than you have...")
            .render(response);
        return;
    }

    if (!Number.isFinite(+amount) || +amount <= 0) {
        console.log(`\t${user.username} ← Negative amount`);
        new StatusView("It does not make any sense!", "You can not pay nothing or less!")
            .render(response);
        return;
    }

    if (card.id == reciever.id) {
        console.log(`\t${user.username} ← Same card`);
        new StatusView("Same card!", "What is the point in transfering money to the same card?")
            .render(response);
        return;
    }

    new ConfirmationView(card, reciever, amount).render(response);
});

router.post("/addcard", function (request, response) {
    const session = request.session;
    if (!session) throw "Session is not initialized!";
    initSession(session);

    if (session.loggedId == -1) {
        response.redirect("/register");
        return;
    }

    let { name = "Untitled Card" } = request.body;

    const user = session.users[session.loggedId] as User;
    console.log(`POST /addcard as ${user.username} [name: ${name}]`);
    User.addCard(user, name);

    response.redirect("/profile");
});

router.post("/pay", function (request, response) {
    const session = request.session;
    if (!session) throw "Session is not initialized!";
    initSession(session);

    if (session.loggedId == -1) {
        response.redirect("/register");
        return;
    }

    const { from, to, amount, validation }: {
        from: number,
        to: number,
        amount: number,
        validation: string
    } = request.body;

    const user = session.users[session.loggedId] as User;
    const card = user.cards.find(x => x.id == +from);
    console.log(`POST /pay as ${user.username} [from: ${from}, to: ${to}, amount: ${amount}, validation:${validation}]`);

    if (!card) {
        console.log(`\t${user.username} ← Wrong card`);
        new StatusView("You do not have this card!", "Try to transfer money from the card YOU have.")
            .render(response);
        return;
    }

    let cards: Card[] = [];
    (session.users as User[]).map(x => {
        cards.push(...x.cards);
    });
    const reciever = cards.find(x => x.id == to);

    const hasher = Crypto.createHash("sha256");
    const hash = hasher.update(
        (+from + +to).toString() + to.toString() + card.transactions +
        amount + "7h15_15_7h3_50l71357_50l7_y0u_h4v3_3v3r_533n!"
    ).digest("hex");

    if (reciever && validation == hash) {
        card.balance -= +amount;
        card.balance = +card.balance.toPrecision(15);
        card.transactions++;
        reciever.balance += +amount;
        reciever.balance = +reciever.balance.toPrecision(15);
        console.log(`\t${user.username} ← ${amount} transfered`);
        new StatusView("Success!", `You successfuly transfered ${amount}\u20BF.`)
            .render(response);
    } else {
        console.log(`\t${user.username} ← Validation fail`);
        new StatusView("Invalid operation!", "Detected an attempt to compromise transaction.")
            .render(response);
    }
});

router.get("/", function (request, response) {
    const session = request.session;
    if (!session) throw "Session is not initialized!";
    initSession(session);

    if (session.loggedId == -1) {
        response.redirect("/register");
    } else {
        response.redirect("/profile");
    }
});

router.get("*", function (request, response) {
    if (Path.extname(request.url)) {
        const bannedExtetions = [".html", ".js", ".css", ".map"];
        if (!bannedExtetions.some(x => request.url.indexOf(x) != -1)) {
            const path = Path.resolve(Path.join(__dirname, "../../..", request.url));

            if (request.url.indexOf("..") != -1) {
                console.log(`GET ${request.url} ← 403 (contains ..)`);
                new ErrorView(403).render(response);
            }

            if (FileSystem.existsSync(path)) {
                if (Path.extname(request.url) != ".otf") {
                    console.log(`GET ${request.url} ← [file: ${path}]`);
                }
                const data = FileSystem.readFileSync(path);
                response.write(data);
                response.end();
            } else {
                if (Path.extname(request.url) != ".ico") {
                    console.log(`GET ${request.url} ← 404 (not found)`);
                }
                new ErrorView(404).render(response);
            }
        } else {
            console.log(`GET ${request.url} ← 403 (banned extention)`);
            new ErrorView(403).render(response);
        }
    } else {
        response.redirect("/");
    }
});

function initSession(session: any): void {
    if (!session.users) {
        session.users = [];
    }

    if (session.loggedId == undefined) {
        session.loggedId = -1;
    }
}

export default router;