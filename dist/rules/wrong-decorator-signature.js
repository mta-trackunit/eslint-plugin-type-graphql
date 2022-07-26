"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const experimental_utils_1 = require("@typescript-eslint/experimental-utils");
const createDisjunction_1 = require("../util/createDisjunction");
const createRule_1 = require("../util/createRule");
const typeGraphQLUtil_1 = require("../util/typeGraphQLUtil");
exports.default = (0, createRule_1.createRule)({
    name: 'wrong-decorator-signature',
    meta: {
        docs: {
            description: 'Warns when the type in the TypeGraphQL decorator is incompatible with the corresponding TypeScript type.',
            recommended: 'error',
            requiresTypeChecking: true,
        },
        messages: {
            wrongDecoratorType: 'Decorator type does not match corresponding TypeScript type. Expected {{ expected }} but found {{ found }}.',
            missingDecoratorNullableOption: 'Decorator options should include {{ expected }}.',
            wrongDecoratorNullableOption: 'Decorator options should specify {{ expected }} but found {{ found }}.',
            superfluousDecoratorNullableOption: 'Decorator options contains superfluous property {{ found }}. Decorated type is not nullable.',
        },
        hasSuggestions: true,
        schema: [
            {
                type: 'object',
                items: {
                    oneOf: [
                        {
                            type: 'string',
                        },
                        {
                            type: 'array',
                            items: {
                                type: 'string',
                            },
                        },
                    ],
                },
            },
        ],
        type: 'problem',
    },
    defaultOptions: [{}],
    create(context, options) {
        const parserServices = experimental_utils_1.ESLintUtils.getParserServices(context);
        const checker = parserServices.program.getTypeChecker();
        return (0, typeGraphQLUtil_1.getTypeGraphQLVisitors)(checker, parserServices, ({ decoratorProps, decoratedProps }) => {
            var _a, _b;
            // Check that both the decorator and decorated type are known
            if (!((_a = decoratorProps.type) === null || _a === void 0 ? void 0 : _a.isValid) || !((_b = decoratedProps.type) === null || _b === void 0 ? void 0 : _b.isValid)) {
                return;
            }
            const expected = (0, typeGraphQLUtil_1.getExpectedTypeGraphQLSignatures)(decoratedProps.type, getAllowedTypes(options, decoratedProps.type));
            const found = (0, typeGraphQLUtil_1.getTypeGraphQLDecoratorSignature)(decoratorProps.type);
            if (!expected.typeFunctions.includes(found.typeFunction) &&
                !(found.originalTypeFunction && expected.typeFunctions.includes(found.originalTypeFunction))) {
                context.report({
                    node: decoratorProps.node,
                    messageId: 'wrongDecoratorType',
                    data: {
                        expected: (0, createDisjunction_1.createDisjunction)(expected.typeFunctions),
                        found: found.typeFunction,
                    },
                });
            }
            if (expected.nullableOption !== found.nullableOption) {
                if (expected.nullableOption && found.nullableOption) {
                    context.report({
                        node: decoratorProps.node,
                        messageId: 'wrongDecoratorNullableOption',
                        data: {
                            expected: expected.nullableOption,
                            found: found.nullableOption,
                        },
                    });
                }
                else if (expected.nullableOption) {
                    context.report({
                        node: decoratorProps.node,
                        messageId: 'missingDecoratorNullableOption',
                        data: {
                            expected: expected.nullableOption,
                        },
                    });
                }
                else if (!found.nullableOption) {
                    context.report({
                        node: decoratorProps.node,
                        messageId: 'superfluousDecoratorNullableOption',
                        data: {
                            found: found.nullableOption,
                        },
                    });
                }
            }
        });
    },
});
const EXPECTED_TYPE_NAME_MAP = {
    number: ['Int', 'Float', 'ID'],
    string: ['String', 'ID'],
    boolean: ['Boolean'],
    Date: ['Date', 'String'],
};
function getAllowedTypes(options, decoratedType) {
    var _a;
    const defaultTypes = EXPECTED_TYPE_NAME_MAP[decoratedType.name] || [decoratedType.name];
    const possibleCustomTypes = (_a = options[0].customTypes) === null || _a === void 0 ? void 0 : _a[decoratedType.name];
    const customTypes = Array.isArray(possibleCustomTypes)
        ? possibleCustomTypes
        : typeof possibleCustomTypes === 'string'
            ? [possibleCustomTypes]
            : [];
    return [...(options[0].replaceDefaultTypes ? [] : defaultTypes), ...customTypes];
}
//# sourceMappingURL=wrong-decorator-signature.js.map