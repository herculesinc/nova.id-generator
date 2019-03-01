// IMPORTS
// ================================================================================================
import { IdGeneratorConfig } from '@nova/id-generator';
import { IdGenerator } from './lib/IdGenerator';

// RE-EXPORTS
// ================================================================================================
export { IdGeneratorError } from './lib/errors';
export { IdGenerator } from './lib/IdGenerator';

// MODULE VARIABLES
// ================================================================================================
let generator: IdGenerator;

// PUBLIC FUNCTIONS
// ================================================================================================
export function configure(config: IdGeneratorConfig): IdGenerator {
    if (generator) throw new TypeError('Global ID generator has already been configured');
    generator = new IdGenerator(config);
    return generator;
}

export function getInstance(): IdGenerator {
    if (!generator) throw new TypeError('Global ID generator has not been configured yet');
    return generator;
}