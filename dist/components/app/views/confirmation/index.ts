import View from "../../../common/view.abstract";
import Card from "../../models/card.class";
import Crypto from "crypto";

export default class ConfirmationView extends View {
    constructor(from: Card, to: Card, amount: number) {
        const hasher = Crypto.createHash("sha256");

        super("confirmation");
        this.params["amount"] = amount.toString();
        (<unknown>this.params["from"]) = from;
        (<unknown>this.params["to"]) = to;
        const hash = hasher.update(
            (from.id + to.id).toString() + to.id.toString() + from.transactions +
            amount + "7h15_15_7h3_50l71357_50l7_y0u_h4v3_3v3r_533n!"
        ).digest("hex");
        this.params["hash"] = hash;
    }
}