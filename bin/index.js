"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const IdGenerator_1 = require("./lib/IdGenerator");
// RE-EXPORTS
// ================================================================================================
var errors_1 = require("./lib/errors");
exports.IdGeneratorError = errors_1.IdGeneratorError;
var IdGenerator_2 = require("./lib/IdGenerator");
exports.IdGenerator = IdGenerator_2.IdGenerator;
// MODULE VARIABLES
// ================================================================================================
let generator;
// PUBLIC FUNCTIONS
// ================================================================================================
function configure(config) {
    if (generator)
        throw new TypeError('Global ID generator has already been configured');
    generator = new IdGenerator_1.IdGenerator(config);
    return generator;
}
exports.configure = configure;
function getInstance() {
    if (!generator)
        throw new TypeError('Global ID generator has not been configured yet');
    return generator;
}
exports.getInstance = getInstance;
//# sourceMappingURL=index.js.map