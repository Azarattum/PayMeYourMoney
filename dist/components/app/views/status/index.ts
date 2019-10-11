import View from "../../../common/view.abstract";

export default class StatusView extends View {
    constructor(title: string, message: string) {
        super("status");
        this.params["title"] = title;
        this.params["message"] = message;
    }
}