import View from "../../../common/view.abstract";

export default class ProfileView extends View {
    constructor() {
        super("profile");
        this.params["username"] = "Test";
        this.params["balance"] = "100";
    }
}