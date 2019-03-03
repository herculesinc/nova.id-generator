"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// IMPORTS
// ================================================================================================
const events = require("events");
const redis = require("redis");
const Long = require("long");
const nova = require("@nova/core");
const errors_1 = require("./errors");
// MODULE VARIABLES
// ================================================================================================
const FILLER_LENGTH = 20;
const MAX_SEQUENCE = Math.pow(2, FILLER_LENGTH);
const DEFAULT_BATCH_SIZE = 100;
const DEFAULT_CACHE_WINDOW = 100;
const LOCAL_COMMAND = {
    name: 'get next id',
    text: `get id from local batch`
};
const REMOTE_COMMAND = {
    name: 'get next id',
    text: `generate new id batch`
};
const ERROR_EVENT = 'error';
// ID format: [sign:1][millisecond:43][sequence:20]
// ID GENERATOR CLASS
// ================================================================================================
class IdGenerator extends events.EventEmitter {
    // CONSTRUCTOR
    // --------------------------------------------------------------------------------------------
    constructor(config) {
        super();
        if (!config)
            throw TypeError('Cannot create ID Generator: config is undefined');
        if (!config.redis)
            throw TypeError('Cannot create ID Generator: redis settings are undefined');
        this.source = { name: config.name || 'id-generator', type: 'redis' };
        this.client = redis.createClient(config.redis);
        this.sequenceKey = `nova::id-generator::${config.name}`;
        this.idBatchSize = config.batch || DEFAULT_BATCH_SIZE;
        this.cacheWindow = config.window || DEFAULT_CACHE_WINDOW;
        this.checkpoint = 0;
        this.timestamp = 0;
        this.sequence = 0;
        this.sequenceMax = 0;
        // listen to error event
        this.client.on('error', (error) => {
            this.emit(ERROR_EVENT, new errors_1.IdGeneratorError(error, 'ID Generator error'));
        });
    }
    // PUBLIC METHODS
    // --------------------------------------------------------------------------------------------
    async getNextId(logger) {
        const start = Date.now();
        if (logger === undefined) {
            logger = nova.logger;
        }
        logger && logger.debug(`Getting next ID`);
        if (this.checkpoint === this.getCheckpoint() && this.sequence < this.sequenceMax) {
            this.sequence++;
            const nextId = buildId(this.timestamp, this.sequence);
            logger && logger.trace(this.source, LOCAL_COMMAND, Date.now() - start, true);
            return Promise.resolve(nextId);
        }
        logger && logger.debug('Generating new ID batch');
        return new Promise((resolve, reject) => {
            this.client.eval(script, 1, this.sequenceKey, this.idBatchSize, (error, reply) => {
                logger && logger.trace(this.source, REMOTE_COMMAND, Date.now() - start, !error);
                if (error) {
                    error = new errors_1.IdGeneratorError(error, 'Failed to get next ID');
                    return reject(error);
                }
                this.checkpoint = this.getCheckpoint();
                this.timestamp = reply[2] * 1000 + Math.floor(reply[3] / 1000);
                this.sequence = reply[0];
                this.sequenceMax = reply[1];
                const nextId = buildId(this.timestamp, this.sequence);
                resolve(nextId);
            });
        });
    }
    // PRIVATE METHODS
    // --------------------------------------------------------------------------------------------
    getCheckpoint() {
        return Math.floor(Date.now() / this.cacheWindow);
    }
}
exports.IdGenerator = IdGenerator;
// HELPER FUNCTIONS
// ================================================================================================
function buildId(timestamp, sequence) {
    let id = Long.fromNumber(timestamp);
    id = id.shiftLeft(FILLER_LENGTH);
    id = id.or(sequence);
    return id.toString(10);
}
// LUA SCRIPT
// ================================================================================================
const script = `
    local sequence_key = KEYS[1]
    local id_count = tonumber(ARGV[1])
    if redis.call("EXISTS", sequence_key) == 0 then
        redis.call("PSETEX", sequence_key, 1, "0")
    end
    local sequence_start = redis.call("INCR", sequence_key)
    local sequence_end = redis.call("INCRBY", sequence_key, id_count)
    if sequence_end >= ${MAX_SEQUENCE} then
        return redis.error_reply("Cannot generate ID, waiting for lock to expire.")
    end
    local time = redis.call("TIME")
    return {
        sequence_start,
        sequence_end,
        tonumber(time[1]),
        tonumber(time[2])
    }
`;
//# sourceMappingURL=IdGenerator.js.map