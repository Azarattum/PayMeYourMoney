var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "../../../common/view.abstract"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    const view_abstract_1 = __importDefault(require("../../../common/view.abstract"));
    class ConfirmationView extends view_abstract_1.default {
        constructor(from, to, amount) {
            super("confirmation");
            this.params["amount"] = amount.toString();
            this.params["from"] = from;
            this.params["to"] = to;
            const hash = "test"; ///TEMP!
            this.params["hash"] = hash;
        }
    }
    exports.default = ConfirmationView;
});
//# sourceMappingURL=index.js.map