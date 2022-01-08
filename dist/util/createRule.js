"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createRule = void 0;
const experimental_utils_1 = require("@typescript-eslint/experimental-utils");
// note - cannot migrate this to an import statement because it will make TSC copy the package.json to the dist folder
// eslint-disable-next-line @typescript-eslint/no-var-requires
const version = require('../../package.json').version;
exports.createRule = experimental_utils_1.ESLintUtils.RuleCreator((name) => `https://github.com/borremosch/eslint-plugin-type-graphql/blob/v${version}/docs/rules/${name}.md`);
//# sourceMappingURL=createRule.js.map