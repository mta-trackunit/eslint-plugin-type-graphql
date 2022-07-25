"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getNameFromCommonJsRequire = void 0;
const types_1 = require("@typescript-eslint/types");
function getNameFromCommonJsRequire(init) {
    var _a, _b;
    if (init.callee.name === 'require' &&
        init.arguments.length === 1 &&
        init.arguments[0].type === types_1.AST_NODE_TYPES.Literal) {
        return (_b = (_a = init.arguments[0].value) === null || _a === void 0 ? void 0 : _a.toString()) !== null && _b !== void 0 ? _b : null;
    }
    return null;
}
exports.getNameFromCommonJsRequire = getNameFromCommonJsRequire;
//# sourceMappingURL=import.js.map