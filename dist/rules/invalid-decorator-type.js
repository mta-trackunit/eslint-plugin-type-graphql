"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const experimental_utils_1 = require("@typescript-eslint/experimental-utils");
const createRule_1 = require("../util/createRule");
const typeGraphQLUtil_1 = require("../util/typeGraphQLUtil");
exports.default = (0, createRule_1.createRule)({
    name: 'wrong-decorator-signature',
    meta: {
        docs: {
            description: 'Warns when TypeGraphQL decorator is poorly configured.',
            recommended: 'error',
            requiresTypeChecking: true,
        },
        messages: {
            multiElementArray: 'Type function array may contain only one element',
            invalidTypeFunction: 'Type function is invalid',
            invalidNullableValue: 'Option { nullable: "{{ nullableValue }}" } may only be used on array types',
        },
        hasSuggestions: true,
        schema: [],
        type: 'problem',
    },
    defaultOptions: [],
    create(context) {
        const parserServices = experimental_utils_1.ESLintUtils.getParserServices(context);
        const checker = parserServices.program.getTypeChecker();
        return (0, typeGraphQLUtil_1.getTypeGraphQLVisitors)(checker, parserServices, ({ decoratorProps }) => {
            // Check whether the decorator type is invalid
            if (!decoratorProps.type || decoratorProps.type.isValid) {
                return;
            }
            if (decoratorProps.type.multiElementArray) {
                context.report({
                    node: decoratorProps.node,
                    messageId: 'multiElementArray',
                });
            }
            if (decoratorProps.type.invalidTypeFunction) {
                context.report({
                    node: decoratorProps.node,
                    messageId: 'invalidTypeFunction',
                });
            }
            if (decoratorProps.type.invalidNullableValue) {
                context.report({
                    node: decoratorProps.node,
                    messageId: 'invalidNullableValue',
                    data: {
                        nullableValue: decoratorProps.type.invalidNullableValue,
                    },
                });
            }
        });
    },
});
//# sourceMappingURL=invalid-decorator-type.js.map