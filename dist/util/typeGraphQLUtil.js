"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getExpectedTypeGraphQLSignatures = exports.getTypeGraphQLDecoratorSignature = exports.getTypeGraphQLVisitors = void 0;
const decoratedValue_1 = require("./decoratedValue");
const decoratorValue_1 = require("./decoratorValue");
const TypeGraphQLContext_1 = require("./TypeGraphQLContext");
function getTypeGraphQLDecoratorVisitor(typeGraphQLContext, checker, parserServices, reporter) {
    return (decoratorNode) => {
        const decoratorProps = (0, decoratorValue_1.getDecoratorProps)({ node: decoratorNode, typeGraphQLContext });
        if (!decoratorProps) {
            // Not a TypeGraphQL decorator, ignore
            return;
        }
        const decoratedProps = (0, decoratedValue_1.getDecoratedProps)({ decoratorNode, checker, parserServices });
        reporter({ decoratorProps, decoratedProps });
    };
}
function getTypeGraphQLVisitors(checker, parserServices, reporter) {
    const typeGraphQLContext = new TypeGraphQLContext_1.TypeGraphQLContext();
    const visitors = typeGraphQLContext.getImportVisitors();
    visitors.Decorator = getTypeGraphQLDecoratorVisitor(typeGraphQLContext, checker, parserServices, reporter);
    return visitors;
}
exports.getTypeGraphQLVisitors = getTypeGraphQLVisitors;
function getTypeGraphQLDecoratorSignature(type) {
    return {
        typeFunction: getTypeFunction(type),
        originalTypeFunction: type.originalName
            ? getTypeFunction({ name: type.originalName, isArray: type.isArray })
            : undefined,
        nullableOption: getNullableOption(type),
    };
}
exports.getTypeGraphQLDecoratorSignature = getTypeGraphQLDecoratorSignature;
function getTypeFunction({ name, isArray }) {
    let typeFunctionBody = name;
    if (isArray) {
        typeFunctionBody = '[' + typeFunctionBody + ']';
    }
    return `() => ${typeFunctionBody}`;
}
function getNullableOption(type) {
    if (type.isArray) {
        if (type.isArrayNullable || type.isArrayUndefinable) {
            if (type.isNullable || type.isUndefinable) {
                return "{ nullable: 'itemsAndList' }";
            }
            return '{ nullable: true }';
        }
        else if (type.isNullable || type.isUndefinable) {
            return "{ nullable: 'items' }";
        }
    }
    else if (type.isNullable || type.isUndefinable) {
        return '{ nullable: true }';
    }
    return undefined;
}
function getExpectedTypeGraphQLSignatures(type, allowedTypes) {
    return {
        typeFunctions: allowedTypes.map((expectedTypeName) => getTypeFunction(Object.assign(Object.assign({}, type), { name: expectedTypeName }))),
        nullableOption: getNullableOption(type),
    };
}
exports.getExpectedTypeGraphQLSignatures = getExpectedTypeGraphQLSignatures;
//# sourceMappingURL=typeGraphQLUtil.js.map