"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const invalid_decorated_type_1 = __importDefault(require("./invalid-decorated-type"));
const invalid_decorator_type_1 = __importDefault(require("./invalid-decorator-type"));
const invalid_nullable_output_type_1 = __importDefault(require("./invalid-nullable-output-type"));
const invalid_nullable_input_type_1 = __importDefault(require("./invalid-nullable-input-type"));
const missing_decorator_type_1 = __importDefault(require("./missing-decorator-type"));
const wrong_decorator_signature_1 = __importDefault(require("./wrong-decorator-signature"));
exports.default = {
    'invalid-decorated-type': invalid_decorated_type_1.default,
    'invalid-decorator-type': invalid_decorator_type_1.default,
    'invalid-nullable-input-type': invalid_nullable_input_type_1.default,
    'invalid-nullable-output-type': invalid_nullable_output_type_1.default,
    'missing-decorator-type': missing_decorator_type_1.default,
    'wrong-decorator-signature': wrong_decorator_signature_1.default,
};
//# sourceMappingURL=index.js.map