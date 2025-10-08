const dotenv = require('dotenv');
dotenv.config();

function isDev() {
  return process.env.DISCORD_TOKEN.endsWith('B2M');
}

module.exports = { isDev };