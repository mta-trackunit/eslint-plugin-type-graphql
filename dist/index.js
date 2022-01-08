"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const rules_1 = __importDefault(require("./rules"));
const all_1 = __importDefault(require("./configs/all"));
const base_1 = __importDefault(require("./configs/base"));
const recommended_1 = __importDefault(require("./configs/recommended"));
module.exports = {
    rules: rules_1.default,
    configs: {
        all: all_1.default,
        base: base_1.default,
        recommended: recommended_1.default,
    },
};
//# sourceMappingURL=index.js.map