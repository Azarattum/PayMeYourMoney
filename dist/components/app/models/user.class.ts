import Crypto from "crypto";
import Card from "./card.class";

export default class User {
    public username: string;
    public password: string;
    public cards: Card[];

    constructor(username: string, password: string) {
        const hash = Crypto.createHash("sha256");

        this.username = username;
        this.password = hash.update(password + process.env.PASSWORD_SALT).digest("base64");
        this.cards = [
            new Card(username, "CTF Card", 100)
        ];
    }

    public static addCard(user: User, name: string): void {
        user.cards.push(new Card(user.username, name));
    }

    public static checkPassword(user: User, password: string): boolean {
        const hash = Crypto.createHash("sha256");
        return hash.update(password + process.env.PASSWORD_SALT).digest("base64") ==
            user.password;
    }
}