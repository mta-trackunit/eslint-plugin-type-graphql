"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const experimental_utils_1 = require("@typescript-eslint/experimental-utils");
const createRule_1 = require("../util/createRule");
const typeGraphQLUtil_1 = require("../util/typeGraphQLUtil");
exports.default = (0, createRule_1.createRule)({
    name: 'wrong-decorator-signature',
    meta: {
        docs: {
            description: 'Warns when a TypeGraphQL decorated type is not expressable in GraphQL.',
            recommended: 'error',
            requiresTypeChecking: true,
        },
        messages: {
            invalidDecoratedType: 'Decorated type is not expressable in GraphQL',
            unionType: "Unexpected decorated union type. Use TypeGraphQL's `createUnionType` to create your union in combination with `typeof MyUnionType` as a type annotation",
        },
        hasSuggestions: true,
        schema: [],
        type: 'problem',
    },
    defaultOptions: [],
    create(context) {
        const parserServices = experimental_utils_1.ESLintUtils.getParserServices(context);
        const checker = parserServices.program.getTypeChecker();
        return (0, typeGraphQLUtil_1.getTypeGraphQLVisitors)(checker, parserServices, ({ decoratedProps }) => {
            var _a, _b;
            // Check whether the decorated type is too complex
            if (!decoratedProps.type || decoratedProps.type.isValid) {
                return;
            }
            if (decoratedProps.type.unionType) {
                context.report({
                    node: (_a = decoratedProps.typeNode) !== null && _a !== void 0 ? _a : decoratedProps.node,
                    messageId: 'unionType',
                });
            }
            else {
                context.report({
                    node: (_b = decoratedProps.typeNode) !== null && _b !== void 0 ? _b : decoratedProps.node,
                    messageId: 'invalidDecoratedType',
                });
            }
        });
    },
});
//# sourceMappingURL=invalid-decorated-type.js.map