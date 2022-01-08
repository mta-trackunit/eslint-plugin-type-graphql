"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createDisjunction = void 0;
function createDisjunction(elements) {
    if (elements.length === 1) {
        return elements[0];
    }
    else if (elements.length === 2) {
        return `${elements[0]} or ${elements[1]}`;
    }
    return (elements
        .slice(0, elements.length - 1)
        .map((element) => `${element}, `)
        .join('') +
        'or ' +
        elements[elements.length - 1]);
}
exports.createDisjunction = createDisjunction;
//# sourceMappingURL=createDisjunction.js.map