"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TypeGraphQLContext = void 0;
const import_1 = require("./import");
const types_1 = require("@typescript-eslint/types");
const TYPE_GRAPHQL_PACKAGE_NAME = 'type-graphql';
class TypeGraphQLContext {
    constructor() {
        this.typeGraphQLImports = {};
        this.imports = {};
    }
    getImportVisitors() {
        return {
            ImportDeclaration: ({ source, specifiers }) => {
                const imports = source.value === TYPE_GRAPHQL_PACKAGE_NAME ? this.typeGraphQLImports : this.imports;
                for (const specifier of specifiers) {
                    switch (specifier.type) {
                        case 'ImportNamespaceSpecifier':
                        case 'ImportDefaultSpecifier':
                            // E.g. import * as TypeGraphQL from 'type-graphql';
                            imports[specifier.local.name] = '*';
                            break;
                        case 'ImportSpecifier':
                            // E.g. import { ObjectType, Field as TypeGraphQLField } from 'type-graphql';
                            imports[specifier.local.name] = specifier.imported.name;
                            break;
                    }
                }
            },
            VariableDeclarator: ({ init, id }) => {
                if ((init === null || init === void 0 ? void 0 : init.type) !== types_1.AST_NODE_TYPES.CallExpression) {
                    return;
                }
                const source = (0, import_1.getNameFromCommonJsRequire)(init);
                if (source === null) {
                    return;
                }
                const imports = source === TYPE_GRAPHQL_PACKAGE_NAME ? this.typeGraphQLImports : this.imports;
                if (id.type === types_1.AST_NODE_TYPES.Identifier) {
                    // E.g. const TypeGraphQL = require('type-graphql');
                    imports[id.name] = '*';
                }
                else if (id.type === types_1.AST_NODE_TYPES.ObjectPattern) {
                    // E.g. const { ObjectType, Field: TypeGraphQLField } = require('type-graphql');
                    for (const property of id.properties) {
                        if (property.type === types_1.AST_NODE_TYPES.RestElement) {
                            // Rest element not supported
                            continue;
                        }
                        const propertyName = property.value.name;
                        imports[propertyName] = property.key.name;
                    }
                }
            },
        };
    }
    _getImportedName(node, map) {
        var _a;
        if (node.type === types_1.AST_NODE_TYPES.Identifier) {
            // E.g. @ObjectType()
            return (_a = map[node.name]) !== null && _a !== void 0 ? _a : null;
        }
        else if (node.type === types_1.AST_NODE_TYPES.MemberExpression &&
            map[node.object.name] === '*') {
            // E.g. @TypeGraphQL.ObjectType()
            return node.property.name;
        }
        return null;
    }
    getTypeGraphQLImportedName(node) {
        return this._getImportedName(node, this.typeGraphQLImports);
    }
    getImportedName(node) {
        return this._getImportedName(node, this.imports);
    }
}
exports.TypeGraphQLContext = TypeGraphQLContext;
//# sourceMappingURL=TypeGraphQLContext.js.map