"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getNullablePropertyValue = exports.getDecoratorProps = exports.decoratorHasName = void 0;
const experimental_utils_1 = require("@typescript-eslint/experimental-utils");
const OPERATION_DECORATORS = ['Mutation', 'Query', 'Subscription'];
const ARG_DECORATOR = 'Arg';
const ARGS_DECORATOR = 'Args';
const FIELD_DECORATOR = 'Field';
const ALL_FIELD_DECORATORS = [...OPERATION_DECORATORS, ARG_DECORATOR, ARGS_DECORATOR, FIELD_DECORATOR];
const INPUT_TYPE_DECORATOR = 'InputType';
const ARGS_TYPE_DECORATOR = 'ArgsType';
const OBJECT_TYPE_DECORATOR = 'ObjectType';
const INTERFACE_TYPE_DECORATOR = 'InterfaceType';
const PARENT_INPUT_DECORATORS = [INPUT_TYPE_DECORATOR, ARGS_TYPE_DECORATOR];
const PARENT_OUTPUT_DECORATORS = [OBJECT_TYPE_DECORATOR, INTERFACE_TYPE_DECORATOR];
function decoratorHasName(decoratorName) {
    return decoratorName === ARG_DECORATOR;
}
exports.decoratorHasName = decoratorHasName;
function getDecoratorProps({ node, typeGraphQLContext }) {
    var _a;
    if (node.expression.type !== experimental_utils_1.AST_NODE_TYPES.CallExpression) {
        return null;
    }
    const name = typeGraphQLContext.getTypeGraphQLImportedName(node.expression.callee);
    if (!name || !ALL_FIELD_DECORATORS.includes(name)) {
        // This is not a known TypeGraphQL decorator
        return null;
    }
    let direction = undefined;
    if (OPERATION_DECORATORS.includes(name)) {
        direction = 'output';
    }
    else if ([ARG_DECORATOR, ARGS_DECORATOR].includes(name)) {
        direction = 'input';
    }
    else {
        //  name === FIELD_DECORATOR
        const parentName = (_a = getDecoratorParentName({ node, typeGraphQLContext })) !== null && _a !== void 0 ? _a : '';
        if (PARENT_INPUT_DECORATORS.includes(parentName)) {
            direction = 'input';
        }
        else if (PARENT_OUTPUT_DECORATORS.includes(parentName)) {
            direction = 'output';
        }
    }
    return {
        name: name,
        type: getDecoratorType(name, node, typeGraphQLContext),
        direction,
        node,
    };
}
exports.getDecoratorProps = getDecoratorProps;
function getDecoratorParentName({ node, typeGraphQLContext }) {
    var _a;
    let currentNode = node;
    while (currentNode.parent) {
        currentNode = currentNode.parent;
        if (currentNode.type === experimental_utils_1.AST_NODE_TYPES.ClassDeclaration) {
            const decorators = (_a = currentNode.decorators) !== null && _a !== void 0 ? _a : [];
            for (const decorator of decorators) {
                if (decorator.expression.type !== experimental_utils_1.AST_NODE_TYPES.CallExpression) {
                    continue;
                }
                const name = typeGraphQLContext.getTypeGraphQLImportedName(decorator.expression.callee);
                if (name) {
                    return name;
                }
            }
        }
    }
    return null;
}
function getDecoratorType(decoratorName, node, typeGraphQLContext) {
    const typeFunctionIndex = decoratorHasName(decoratorName) ? 1 : 0;
    const typeFunctionNode = node.expression.arguments[typeFunctionIndex];
    if ((typeFunctionNode === null || typeFunctionNode === void 0 ? void 0 : typeFunctionNode.type) !== experimental_utils_1.AST_NODE_TYPES.ArrowFunctionExpression &&
        (typeFunctionNode === null || typeFunctionNode === void 0 ? void 0 : typeFunctionNode.type) !== experimental_utils_1.AST_NODE_TYPES.FunctionExpression) {
        return undefined;
    }
    let typeNode = typeFunctionNode.body;
    let isArray = false;
    if (typeNode.type === experimental_utils_1.AST_NODE_TYPES.ArrayExpression) {
        if (typeNode.elements.length !== 1) {
            // Array must have precisely one element
            return { isValid: false, multiElementArray: true };
        }
        typeNode = typeNode.elements[0];
        isArray = true;
    }
    let name = typeGraphQLContext.getTypeGraphQLImportedName(typeNode);
    if (!name && typeNode.type === experimental_utils_1.AST_NODE_TYPES.Identifier) {
        name = typeNode.name;
    }
    if (!name) {
        return { isValid: false, invalidTypeFunction: true };
    }
    const nullablePropertyValue = getNullablePropertyValue(node.expression.arguments[typeFunctionIndex + 1]);
    if ((nullablePropertyValue === 'items' || nullablePropertyValue === 'itemsAndList') && !isArray) {
        // these nullable properties are only available on arrays
        return { isValid: false, invalidNullableValue: nullablePropertyValue };
    }
    return {
        isValid: true,
        name,
        originalName: typeGraphQLContext.getImportedName(typeNode),
        isNullable: (!isArray && nullablePropertyValue === true) ||
            nullablePropertyValue === 'itemsAndList' ||
            nullablePropertyValue === 'items',
        isArray,
        isArrayNullable: isArray && (nullablePropertyValue === true || nullablePropertyValue === 'itemsAndList'),
    };
}
/**
 * Reads nullable property from options object as described here: https://github.com/MichalLytek/type-graphql/blob/master/docs/types-and-fields.md
 */
function getNullablePropertyValue(optionsObject) {
    if ((optionsObject === null || optionsObject === void 0 ? void 0 : optionsObject.type) !== experimental_utils_1.AST_NODE_TYPES.ObjectExpression) {
        return false;
    }
    for (const property of optionsObject.properties) {
        if (property.type !== experimental_utils_1.AST_NODE_TYPES.Property ||
            property.key.type !== experimental_utils_1.AST_NODE_TYPES.Identifier ||
            property.key.name !== 'nullable' ||
            property.value.type !== experimental_utils_1.AST_NODE_TYPES.Literal) {
            continue;
        }
        if (property.value.value === true || property.value.value === 'items' || property.value.value === 'itemsAndList') {
            return property.value.value;
        }
    }
    return false;
}
exports.getNullablePropertyValue = getNullablePropertyValue;
//# sourceMappingURL=decoratorValue.js.map