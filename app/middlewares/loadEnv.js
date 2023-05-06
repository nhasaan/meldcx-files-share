const path = require('path');
const dotenv = require('dotenv')
const envFile = `${path.resolve(process.cwd(), '.env')}`

const loadEnv = (req, res, next) =>{
    if(envFile) {
        dotenv.config(envFile)
    } else {
        console.log('Env not found');
    }
    next();
}

module.exports = loadEnv