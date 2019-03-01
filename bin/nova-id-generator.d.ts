declare module "@nova/id-generator" {
    
    // IMPORTS AND RE-EXPORTS
    // --------------------------------------------------------------------------------------------
    import * as events from 'events';
    import * as tls from 'tls';

    import { Logger, Exception } from '@nova/core';
    export { Logger, TraceSource, TraceCommand } from '@nova/core';

    // REDIS CONNECTION
    // --------------------------------------------------------------------------------------------
    export interface RedisConnectionConfig {
        host            : string;
        port            : number;
        password        : string;
        prefix?         : string;
        tls?            : tls.ConnectionOptions;
        retry_strategy? : (options: ConnectionRetryOptions) => number | Error;
    }

    export interface ConnectionRetryOptions {
        error           : any;
        attempt         : number;
        total_retry_time: number;
        times_connected : number;
    }

    // ID GENERATOR
    // --------------------------------------------------------------------------------------------
    export interface IdGeneratorConfig {
        name            : string;
        batch?          : number;
        window?         : number;
        redis           : RedisConnectionConfig;
    }
    
    export class IdGenerator {
		constructor(config: IdGeneratorConfig);
		getNextId(logger?: Logger): Promise<string>;
    }

    // SINGLETON
    // --------------------------------------------------------------------------------------------
    export function configure(config: IdGeneratorConfig): IdGenerator;
    export function getInstance(): IdGenerator;

    // ERRORS
    // --------------------------------------------------------------------------------------------
    export class IdGeneratorError extends Exception {
        constructor(cause: Error, message: string);
    }
}