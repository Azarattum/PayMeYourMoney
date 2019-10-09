var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "crypto", "./card.class"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    const crypto_1 = __importDefault(require("crypto"));
    const card_class_1 = __importDefault(require("./card.class"));
    class User {
        constructor(username, password) {
            const hash = crypto_1.default.createHash("sha256");
            this.username = username;
            this.password = hash.update(password + process.env.PASSWORD_SALT).digest("base64");
            this.cards = [
                new card_class_1.default(username, "CTF Card", 100)
            ];
        }
        static addCard(user, name) {
            user.cards.push(new card_class_1.default(user.username, name));
        }
        static checkPassword(user, password) {
            const hash = crypto_1.default.createHash("sha256");
            return hash.update(password + process.env.PASSWORD_SALT).digest("base64") ==
                user.password;
        }
    }
    exports.default = User;
});
//# sourceMappingURL=user.class.js.map