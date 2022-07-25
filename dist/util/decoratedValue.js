"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDecoratedProps = void 0;
const experimental_utils_1 = require("@typescript-eslint/experimental-utils");
const typescript_1 = require("typescript");
function getPossibleUnionName(typedNode) {
    var _a, _b, _c, _d;
    let typeAnnotation;
    if (typedNode.type === experimental_utils_1.AST_NODE_TYPES.Identifier || typedNode.type === experimental_utils_1.AST_NODE_TYPES.PropertyDefinition) {
        typeAnnotation = (_a = typedNode.typeAnnotation) === null || _a === void 0 ? void 0 : _a.typeAnnotation;
    }
    else if (typedNode.type === experimental_utils_1.AST_NODE_TYPES.MethodDefinition && typedNode.kind === 'method') {
        typeAnnotation = (_b = typedNode.value.returnType) === null || _b === void 0 ? void 0 : _b.typeAnnotation;
    }
    if (!typeAnnotation) {
        return;
    }
    if (typeAnnotation.type === experimental_utils_1.AST_NODE_TYPES.TSTypeReference &&
        ['Array', 'Promise'].includes(typeAnnotation.typeName.name)) {
        typeAnnotation = ((_d = (_c = typeAnnotation.typeParameters) === null || _c === void 0 ? void 0 : _c.params) === null || _d === void 0 ? void 0 : _d[0]) || typeAnnotation;
    }
    if (typeAnnotation.type === experimental_utils_1.AST_NODE_TYPES.TSTypeQuery &&
        typeAnnotation.exprName.type === experimental_utils_1.AST_NODE_TYPES.Identifier) {
        return typeAnnotation.exprName.name;
    }
    return undefined;
}
function getDecoratedProps({ decoratorNode, checker, parserServices }) {
    var _a, _b, _c;
    const parent = decoratorNode.parent;
    const tsNode = parserServices.esTreeNodeToTSNodeMap.get(parent);
    let type = checker.getTypeAtLocation(tsNode);
    let typeNode = undefined;
    let isPropertyOptional = false;
    if (parent.type === experimental_utils_1.AST_NODE_TYPES.MethodDefinition) {
        typeNode = (_a = parent.value.returnType) === null || _a === void 0 ? void 0 : _a.typeAnnotation;
        if (parent.kind === 'method' && type.getCallSignatures()[0]) {
            type = type.getCallSignatures()[0].getReturnType();
        }
    }
    else if (parent.type === experimental_utils_1.AST_NODE_TYPES.PropertyDefinition) {
        isPropertyOptional = parent.optional || false;
        typeNode = (_b = parent.typeAnnotation) === null || _b === void 0 ? void 0 : _b.typeAnnotation;
    }
    else {
        typeNode = (_c = parent.typeAnnotation) === null || _c === void 0 ? void 0 : _c.typeAnnotation;
    }
    return {
        kind: parent.type,
        type: getDecoratedType(type, getPossibleUnionName(parent), isPropertyOptional),
        node: parent,
        typeNode,
    };
}
exports.getDecoratedProps = getDecoratedProps;
function getDecoratedType(type, possibleUnionName, isPropertyOptional) {
    var _a, _b;
    // Check whether TypeScript was able to determine the type
    if (type.flags === typescript_1.TypeFlags.Any) {
        return null;
    }
    // Check wheter the type is a promise
    if (type.flags === typescript_1.TypeFlags.Object && ((_a = type.symbol) === null || _a === void 0 ? void 0 : _a.escapedName) === 'Promise') {
        const typeArguments = type.resolvedTypeArguments;
        const innerType = getDecoratedType(typeArguments[0], possibleUnionName, isPropertyOptional);
        if (!(innerType === null || innerType === void 0 ? void 0 : innerType.isValid)) {
            return innerType;
        }
        return Object.assign(Object.assign({}, innerType), { isPromise: true });
    }
    // Check whether the type is nullable or undefinable
    let isNullable = false;
    let isUndefinable = false;
    let isBooleanUnion = false;
    if (type.flags === typescript_1.TypeFlags.Union) {
        const innerTypes = [...type.types];
        for (let i = innerTypes.length - 1; i >= 0; i--) {
            if (innerTypes[i].flags === typescript_1.TypeFlags.Null) {
                isNullable = true;
                innerTypes.splice(i, 1);
            }
            else if (innerTypes[i].flags === typescript_1.TypeFlags.Undefined) {
                isUndefinable = true;
                innerTypes.splice(i, 1);
            }
        }
        if (innerTypes.length === 0) {
            // null/undefined-only types are not supported;
            return {
                isValid: false,
                nullOrUndefinedType: true,
            };
        }
        else if (innerTypes.length > 1) {
            // Check whether this is a boolean
            if (innerTypes.length === 2 && innerTypes.every((innerType) => innerType.flags === typescript_1.TypeFlags.BooleanLiteral)) {
                isBooleanUnion = true;
            }
            else {
                // Check whether all types in union are part of the same enumeration (type is actually a nullable/undefinable enumartion)
                const enumerationNames = innerTypes.map(
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                (innerType) => innerType.flags & typescript_1.TypeFlags.EnumLiteral && innerType.symbol.parent.name);
                const isSameEnumeration = !!enumerationNames[0] && enumerationNames.every((enumerationName) => enumerationName === enumerationNames[0]);
                if (!isSameEnumeration) {
                    // Not an enumation. Union types may still be valid, for example when created using createUnionType. If we found a possible union type in the AST, we will use it
                    if (possibleUnionName) {
                        return {
                            isValid: true,
                            name: possibleUnionName,
                            isNullable,
                            isUndefinable,
                            isArray: false,
                        };
                    }
                    else {
                        return {
                            isValid: false,
                            unionType: true,
                        };
                    }
                }
            }
        }
        type = innerTypes[0];
    }
    // Check whether the type is an array
    if (type.flags === typescript_1.TypeFlags.Object && ((_b = type.symbol) === null || _b === void 0 ? void 0 : _b.name) === 'Array') {
        const typeArguments = type.resolvedTypeArguments;
        const innerType = getDecoratedType(typeArguments[0], possibleUnionName, false);
        if (!innerType) {
            return null;
        }
        if (!innerType.isValid) {
            // Inner type is invalid
            return innerType;
        }
        else if (innerType.isPromise || innerType.isArray) {
            // Types are nested in an unsupported way
            return {
                isValid: false,
                tooComplex: true,
            };
        }
        return Object.assign(Object.assign({}, innerType), { isArray: true, isArrayNullable: isNullable, isArrayUndefinable: isUndefinable || isPropertyOptional });
    }
    // Check whether the type is a literal
    if (type.flags === typescript_1.TypeFlags.Number) {
        return {
            isValid: true,
            name: 'number',
            isNullable,
            isUndefinable: isUndefinable || isPropertyOptional,
            isArray: false,
        };
    }
    else if (type.flags === typescript_1.TypeFlags.String) {
        return {
            isValid: true,
            name: 'string',
            isNullable,
            isUndefinable: isUndefinable || isPropertyOptional,
            isArray: false,
        };
    }
    else if (type.flags & typescript_1.TypeFlags.Boolean || isBooleanUnion) {
        return {
            isValid: true,
            name: 'boolean',
            isNullable,
            isUndefinable: isUndefinable || isPropertyOptional,
            isArray: false,
        };
    }
    // Check whether the type is an object or enum
    if (type.flags & typescript_1.TypeFlags.EnumLiteral || type.flags === typescript_1.TypeFlags.TypeParameter || type.flags === typescript_1.TypeFlags.Object) {
        let symbol = type.symbol;
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        if ((symbol === null || symbol === void 0 ? void 0 : symbol.flags) === typescript_1.SymbolFlags.EnumMember && symbol.parent.flags === typescript_1.SymbolFlags.RegularEnum) {
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            symbol = symbol.parent;
        }
        return {
            isValid: true,
            name: symbol === null || symbol === void 0 ? void 0 : symbol.name,
            isNullable,
            isUndefinable: isUndefinable || isPropertyOptional,
            isArray: false,
        };
    }
    // Other types are unsupported
    return {
        isValid: false,
        unknownType: true,
    };
}
//# sourceMappingURL=decoratedValue.js.map