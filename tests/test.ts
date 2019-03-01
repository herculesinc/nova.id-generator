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
        host    : '',
        port    : 6380,
        password: '',
        tls: {
            servername: ""
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