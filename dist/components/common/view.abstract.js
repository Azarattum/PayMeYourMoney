var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "path"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    const path_1 = __importDefault(require("path"));
    class View {
        constructor(name) {
            this.name = name;
            this.params = {};
        }
        render(response) {
            this.params["basedir"] = path_1.default.join(__dirname.replace("src", "dist"), "../app/views", this.name);
            response.render(this.name, this.params);
        }
    }
    exports.default = View;
});
//# sourceMappingURL=view.abstract.js.map