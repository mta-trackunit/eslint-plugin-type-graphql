"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const experimental_utils_1 = require("@typescript-eslint/experimental-utils");
const createRule_1 = require("../util/createRule");
const typeGraphQLUtil_1 = require("../util/typeGraphQLUtil");
exports.default = (0, createRule_1.createRule)({
    name: 'invalid-nullable-input-type',
    meta: {
        docs: {
            description: 'Warns when undefined is used in a type that is decorated with a TypeGraphQL decorator',
            recommended: 'warn',
            requiresTypeChecking: true,
        },
        messages: {
            invalidNullableInputType: 'Nullable input types should be defined as Type | null | undefined',
        },
        schema: [],
        hasSuggestions: true,
        type: 'problem',
    },
    defaultOptions: [],
    create(context) {
        const parserServices = experimental_utils_1.ESLintUtils.getParserServices(context);
        const checker = parserServices.program.getTypeChecker();
        return (0, typeGraphQLUtil_1.getTypeGraphQLVisitors)(checker, parserServices, ({ decoratorProps, decoratedProps }) => {
            var _a, _b, _c;
            // Check whether the decorator and decorated type area known and valid, and whether this is an input
            if (!((_a = decoratedProps.type) === null || _a === void 0 ? void 0 : _a.isValid) || !((_b = decoratorProps.type) === null || _b === void 0 ? void 0 : _b.isValid) || decoratorProps.direction !== 'input') {
                return;
            }
            // Check whether isArray is set similar for the decorator and decorated type
            if (decoratorProps.type.isArray !== decoratedProps.type.isArray) {
                return;
            }
            if ((decoratorProps.type.isArrayNullable &&
                (!decoratedProps.type.isArrayUndefinable || !decoratedProps.type.isArrayNullable)) ||
                (decoratorProps.type.isNullable && (!decoratedProps.type.isUndefinable || !decoratedProps.type.isNullable))) {
                // This type is either not nullable or not undefinable
                context.report({
                    node: (_c = decoratedProps.typeNode) !== null && _c !== void 0 ? _c : decoratedProps.node,
                    messageId: 'invalidNullableInputType',
                });
            }
        });
    },
});
//# sourceMappingURL=invalid-nullable-input-type.js.map