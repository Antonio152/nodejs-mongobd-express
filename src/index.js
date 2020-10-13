require('dotenv').config(); // before app starts, import enviroment variables

const app = require('./app');
require('./database');

// inside the function, it allows us to use AssSync await to prevent callbacks
async function main() {
    
    await app.listen(app.get('port'));
    console.log('Server on port', app.get('port'));
}

main();