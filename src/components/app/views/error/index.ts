import View from "../../../common/view.abstract";

export default class ErrorView extends View {
    constructor(code: Number) {
        super("error");
        this.params["Code"] = code.toString();
    }
}