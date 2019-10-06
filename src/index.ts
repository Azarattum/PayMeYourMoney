import Express from "express";
import BodyParser from "body-parser";
import ErrorView from "./components/app/views/error";
import RegisterView from "./components/app/views/register";

let app = Express();
let router = Express.Router()
app.use(BodyParser.json());
app.use(
    BodyParser.urlencoded({
        extended: true
    })
);

app.locals.basedir = __dirname;
app.set("views", "./src/components/app/views");
app.set("view engine", "pug");

router.get('/register', function (request, response) {
    let view = new RegisterView();
    view.render(response);
});

router.get("/", function (request, response) {
    response.redirect("/register");
});

router.get("*", function (request, response) {
    new ErrorView(404).render(response);
});

app.use(router);
app.listen(80);