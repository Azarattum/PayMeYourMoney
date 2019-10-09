import View from "../../../common/view.abstract";
import User from "../../models/user.class";

export default class ProfileView extends View {
    constructor(user: User) {
        super("profile");
        this.params["username"] = user.username;
        (<unknown>this.params["cards"]) = user.cards;
    }
}