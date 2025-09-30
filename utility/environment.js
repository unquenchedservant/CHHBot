const dotenv = require('dotenv');
dotenv.config();

function is_dev() {
	return process.env.DISCORD_TOKEN.endsWith('B2M');
}

module.exports = { is_dev };