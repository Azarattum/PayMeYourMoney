import Express from "express";
import BodyParser from "body-parser";
import Session from "express-session";
import DotEnv from "dotenv";
import Router from "./components/app/controllers/router"

DotEnv.config();
let app = Express();

app.locals.basedir = __dirname;
app.set("views", "./src/components/app/views");
app.set("view engine", "pug");

app.use(BodyParser.json());
app.use(BodyParser.urlencoded({
    extended: true
}));
app.use(Session({
    secret: process.env.SESSION_SECRET + "",
    resave: false,
    saveUninitialized: false
}));
app.use(Router);

app.listen(2012);