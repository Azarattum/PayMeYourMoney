import View from "../../../common/view.abstract";
import Card from "../../models/card.class";

export default class TransactionView extends View {
    constructor(card: Card) {
        super("transaction");
        (<unknown>this.params["card"]) = card;
    }
}