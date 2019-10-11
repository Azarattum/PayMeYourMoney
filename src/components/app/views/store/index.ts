import View from "../../../common/view.abstract";
import User from "../../models/user.class";

export default class StoreView extends View {
    constructor(user?: User) {
        super("store");
        (<unknown>this.params["cards"]) = user ? user.cards : null;
    }
}