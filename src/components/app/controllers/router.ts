import Express from "express";
import RegisterView from "../views/register";
import ErrorView from "../views/error";
import User from "../models/user.class";
import StatusView from "../views/status";
import ProfileView from "../views/profile";

let router = Express.Router()

router.get('/register', function (request, response) {
    const session = request.session;
    if (!session) throw "Session is not initialized!";
    initSession(session);

    if (session.loggedId != -1) {
        response.redirect("/profile");
    }

    let view = new RegisterView();
    view.render(response);
});

router.post('/register', function (request, response) {
    const session = request.session;
    if (!session) throw "Session is not initialized!";
    initSession(session);

    let users: User[] = session.users;
    let { name, password } = request.body;

    if (!(<string>name).match(/[-_a-zA-Z0-9]+/) ||
        !(<string>password).match(/[-_a-zA-Z0-9]+/)) {
        new StatusView("Wrong format!", "Try to follow the rules instead of hacking website.")
            .render(response);
        return;
    }

    let user = users.find(x => x.username == name) as User;
    if (user) {
        if (!User.checkPassword(user, password)) {
            new StatusView("Invalid password! Or taken name!",
                "Enter a valid password or a different name if you try to register.")
                .render(response);
            return;
        }
    }
    else {
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
    let view = new ProfileView(user);
    view.render(response);
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
    new ErrorView(404).render(response);
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