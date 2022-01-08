"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const experimental_utils_1 = require("@typescript-eslint/experimental-utils");
const createRule_1 = require("../util/createRule");
const typeGraphQLUtil_1 = require("../util/typeGraphQLUtil");
exports.default = (0, createRule_1.createRule)({
    name: 'missing-decorator-type',
    meta: {
        docs: {
            description: 'Warns when a decorator is missing a type',
            recommended: 'error',
            requiresTypeChecking: true,
        },
        messages: {
            missingNonTrivialDecoratorType: 'No type function specified for non-trivial type',
            missingNumberDecoratorType: 'No type function specified for number type (specify TypeGraphQL `Int` or `Float` type)',
            missingDecoratorType: 'This decorator does not explicitly specify a type',
        },
        hasSuggestions: true,
        schema: [
            {
                type: 'string',
                enum: ['nontrivial', 'nontrivial-and-number', 'all'],
            },
        ],
        type: 'problem',
    },
    defaultOptions: ['nontrivial-and-number'],
    create(context, [strictness]) {
        const parserServices = experimental_utils_1.ESLintUtils.getParserServices(context);
        const checker = parserServices.program.getTypeChecker();
        return (0, typeGraphQLUtil_1.getTypeGraphQLVisitors)(checker, parserServices, ({ decoratorProps, decoratedProps }) => {
            var _a;
            // Check whether this decorator type is erroneous
            if (!((_a = decoratedProps.type) === null || _a === void 0 ? void 0 : _a.isValid) || decoratorProps.type) {
                return;
            }
            // Get properties of decorated type
            const isNonTrivial = decoratedProps.type.isPromise ||
                decoratedProps.type.isArray ||
                decoratedProps.type.isNullable ||
                decoratedProps.type.isArrayNullable;
            if (isNonTrivial) {
                // Always report missing nontrivial decorator types
                context.report({
                    node: decoratorProps.node,
                    messageId: 'missingNonTrivialDecoratorType',
                });
            }
            else if (decoratedProps.type.name === 'number' &&
                (strictness === 'all' || strictness === 'nontrivial-and-number')) {
                // Report missing number decorator types based on strictness
                context.report({
                    node: decoratorProps.node,
                    messageId: 'missingNumberDecoratorType',
                });
            }
            else if (strictness === 'all') {
                // In most strict mode, report everything
                context.report({
                    node: decoratorProps.node,
                    messageId: 'missingDecoratorType',
                });
            }
        });
    },
});
//# sourceMappingURL=missing-decorator-type.js.map