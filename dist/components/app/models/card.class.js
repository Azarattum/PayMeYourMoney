(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class Card {
        constructor(owner, name, balance = 0) {
            this.transactions = 0;
            this.owner = owner;
            let id;
            do {
                id = +Math.random().toFixed(16).toString().substring(2, 18);
            } while (id.toString().length != 16);
            this.id = id;
            this.name = name;
            this.balance = balance;
        }
    }
    exports.default = Card;
});
//# sourceMappingURL=card.class.js.map