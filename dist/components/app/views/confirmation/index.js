var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "../../../common/view.abstract", "crypto"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    const view_abstract_1 = __importDefault(require("../../../common/view.abstract"));
    const crypto_1 = __importDefault(require("crypto"));
    class ConfirmationView extends view_abstract_1.default {
        constructor(from, to, amount) {
            const hasher = crypto_1.default.createHash("sha256");
            super("confirmation");
            this.params["amount"] = amount.toString();
            this.params["from"] = from;
            this.params["to"] = to;
            const hash = hasher.update((from.id + to.id).toString() + to.id.toString() + from.transactions +
                amount + "7h15_15_7h3_50l71357_50l7_y0u_h4v3_3v3r_533n!").digest("hex");
            this.params["hash"] = hash;
        }
    }
    exports.default = ConfirmationView;
});
//# sourceMappingURL=index.js.map