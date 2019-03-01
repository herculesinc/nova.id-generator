"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// IMPORTS
// ================================================================================================
const core_1 = require("@nova/core");
// ERRORS
// ================================================================================================
class IdGeneratorError extends core_1.Exception {
    constructor(cause, message) {
        super({ cause, message });
    }
}
exports.IdGeneratorError = IdGeneratorError;
//# sourceMappingURL=errors.js.map