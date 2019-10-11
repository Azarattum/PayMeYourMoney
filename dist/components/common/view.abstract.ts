import Express from "express"
import Path from "path";

export default abstract class View {
    public params: { [key: string]: string } = {};

    constructor(public name: string) { }

    render(response: Express.Response) {
        this.params["basedir"] = Path.join(
            __dirname.replace("src", "dist"),
            "../app/views",
            this.name
        );
        response.render(this.name, this.params);
    }
}