// IMPORTS
// ================================================================================================
import { Exception } from '@nova/core';

// ERRORS
// ================================================================================================
export class IdGeneratorError extends Exception {
    constructor(cause: Error, message: string) {
        super({ cause, message });
    }
}