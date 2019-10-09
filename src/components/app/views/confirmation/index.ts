import View from "../../../common/view.abstract";
import Card from "../../models/card.class";

export default class ConfirmationView extends View {
    constructor(from: Card, to: Card, amount: number) {
        super("confirmation");
        this.params["amount"] = amount.toString();
        (<unknown>this.params["from"]) = from;
        (<unknown>this.params["to"]) = to;
        const hash = "test";///TEMP!
        this.params["hash"] = hash;
    }
}