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
    class TransactionView extends view_abstract_1.default {
        constructor(card) {
            super("transaction");
            this.params["card"] = card;
        }
    }
    exports.default = TransactionView;
});
//# sourceMappingURL=index.js.map