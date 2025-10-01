const { Events } = require('discord.js');
const logger = require('../utility/logger');
const config = require('../utility/config');

const benLastSent = new Map();
const socksLastSent = new Map();

const ben_timeout = 30 * 1000;
const socks_timeout = 30 * 1000;

const allowed = [1, 3, 6, 9, 10];
const max_rand = 100;

function isAprilFirst() {
	const today = new Date();
	return today.getMonth === 3 && today.getDate === 1;
}

function getSocksLastSent(channelId) {
	if (!socksLastSent.has(channelId)) {
		socksLastSent.set(channelId, 0);
	}
	return socksLastSent.get(channelId);
}

function setSocksLastSent(channelId) {
	socksLastSent.set(channelId, Date.now());
}

function getBenLastSent(channelId) {
	if (!benLastSent.has(channelId)) {
		benLastSent.set(channelId, 0);
	}
	return benLastSent.get(channelId);
}

function setBenLastSent(channelId) {
	benLastSent.set(channelId, Date.now());
}

async function handleBen(message) {
	const now = Date.now();
	const lastSent = getBenLastSent(message.channel.id);
	if (message.content.includes('🥀') && now - lastSent >= ben_timeout) {
		if (allowed.includes(Math.floor(Math.random() * max_rand) + 1)) {
			setBenLastSent(message.channel.id);
			logger.info('Wilted rose');
			await message.channel.send('Yeah yeah just reply with a wilted rose');
		}

	}
}


async function handleSocks(message) {
	const now = Date.now();
	const lastSent = getSocksLastSent(message.channel.id);
	if (message.content.toLowerCase().includes('socks') && now - lastSent >= socks_timeout) {
		if (allowed.includes(Math.floor(Math.random() * max_rand) + 1)) {
			setSocksLastSent(message.channel.id);
			logger.info('Socks knocked off');
			await message.channel.send('So, I don\'t wanna like... Knock anyone\'s socks off or anything, but I recently became a full time employee at a coffee shop');
		}
	}
}

async function handleAprilFools(message) {
	const star = '⭐';

	const excludedChannels = [config.get_staff_help_id(), config.get_staff_id(), config.get_staff_bot_id(),
		config.get_report_id(), config.get_staff_partner_id, config.get_reddit_channel_id(), config.get_starboard_channel(),
		902769402573881375n, config.get_bot_commands_id, config.get_mod_log_id(), 705478446075215893n,
		config.get_announcements_channel_id(), config.get_partners_id(), config.get_artist_role_menu_id(),
		776157426113970207n, config.get_rules_id(), config.get_welcome_id()];

	if (!message.author.bot && !excludedChannels.includes(message.channel.id)) {
		const afAllowed = [3, 8];
		if (afAllowed.includes(Math.floor(Math.random() * 10) + 1)) {
			await message.react(star);
		}
	}
	// all excluded channels for guild in question
}

async function checkIds(message) {
	const roleIds = message.member?.roles.cache.map(role => role.id) || [];
	const allowed_ids = [489532994898362388n, 806328902217760818n, 613467520640221208n, 806563614013915176n];
	for (const role of roleIds) {
		if (allowed_ids.includes(role)) {
			return true;
		}
	}
	return false;
}
async function handleStick(message) {
	const allowed_stick = ['<:stick:743597072598433924>', '<:broken_stick:769693076938817577>',
		'stick', 'kcits', 'st1ck', 'st!ck', '$tick', '$t1ck', '$t!ck',
		'5t1ck', '5t!ck', '5t1(k', '5t!k', 'st1(k', 'st!k',
		'$t1(k', '$t!k', '$t1c|', '$t!c|', '$t1<k', '$t!<k',
		'St1ck', 'St!ck', 'sT1ck', 'sT!ck', 'ST1CK', 'ST!CK',
		'$t1(k', '$t!<k', '$t1c|', '$t!c|', '$t1<|', '$t!<|',
		'st1x', 'st!x', '$t1x', '$t!x', 'stix', '$tix',
		'ѕtιcк', 'ʂȶɨƈƙ', 'ꜱᴛɪᴄᴋ', '₴₮ł₵₭'];

	if (!allowed_stick.includes(message.content.toLowerCase()) && !checkIds(message)) {
		logger.info('Non-stick message deleted');
		await message.delete();
	}
}
module.exports = {
	name: Events.MessageCreate,
	once: false,
	async execute(message) {
		await handleBen(message);
		await handleSocks(message);

		if (message.channel.id == config.get_stick_id()) {
			await handleStick(message);
		}


		if (isAprilFirst()) {
			await handleAprilFools(message);
		}
	},
};