const dotenv = require('dotenv');

dotenv.config();

const token = process.env.DISCORD_TOKEN;

function is_dev(){
    return token.endsWith("B2M")    
}

module.exports = {
    is_dev
}