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
    class StoreView extends view_abstract_1.default {
        constructor(user) {
            super("store");
            this.params["cards"] = user ? user.cards : null;
        }
    }
    exports.default = StoreView;
});
//# sourceMappingURL=index.js.map