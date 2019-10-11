import View from "../../../common/view.abstract";

export default class ErrorView extends View {
    constructor(code: Number) {
        super("status");
        this.params["title"] = "Ooops... Something went wrong!";
        this.params["message"] = `You got error ${code}, it means that ${ErrorCodes[+code]}.`;
    }
}

const ErrorCodes: { [error: number]: string } = {
    404: "file not found",
    403: "access forbidden"
};