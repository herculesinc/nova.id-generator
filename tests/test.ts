// IMPORTS
// ================================================================================================
import { IdGenerator } from '../index';

// SETUP
// ================================================================================================
const config = {
    name        : 'testgenerator',
    batch       : 10,
    window      : 100,
    redis: {
        prefix  : 'testgenerator',
        host    : 'credo-dev.redis.cache.windows.net',
        port    : 6380,
        password: 'r+K9d+jvY7HM8zK8q1G2sFryAhaBBYydYFIT5s4Br8E=',
        tls: {
            servername: "credo-dev.redis.cache.windows.net"
        }
    }
};

const generator = new IdGenerator(config);

// CREATE SERVER
// ================================================================================================
(async function runTest() { 
    try {
        console.log(await generator.getNextId());
        console.log(await generator.getNextId());
        console.log(await generator.getNextId());
        console.log(await generator.getNextId());
        console.log(await generator.getNextId());

        console.log(await generator.getNextId());
        console.log(await generator.getNextId());

        setTimeout(async function() {
            console.log(await generator.getNextId());
            console.log(await generator.getNextId());
            console.log(await generator.getNextId());
        }, 100);
    }
    catch (e) {
        console.log(e.stack);
        console.log(JSON.stringify(e));
    }
})();