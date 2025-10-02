const { EmbedBuilder } = require('discord.js');
const { StarboardSettingsDB, StarboardDB, ModboardDB } = require('../db/starboard');
const config = require('../utility/config');
const { is_dev } = require('../utility/environment');
const logger = require('./logger');

const starboardSettingsDB = new StarboardSettingsDB();
const starboardDB = new StarboardDB();
const modboardDB = new ModboardDB();


async function getTrueCount(message) {
	let trueCount = 0;
	for (const reaction of message.reactions.cache.values()) {
		if (reaction.emoji.name === '⭐') {
			if (!is_dev()) {
				const users = await reaction.users.fetch();
				trueCount = Array.from(users.values()).filter(user =>
					!user.bot && user.id !== message.author.id,
				).length;
			}
			else {
				trueCount = reaction.count;
			}
		}
	}
	return trueCount;
}

async function getModCount(message) {
	let modCount = 0;
	for (const reaction of message.reactions.cache.values()) {
		if (reaction.emoji.name === '⭐') {
			const users = await reaction.users.fetch();
			if (is_dev()) {
				modCount = Array.from(users.values()).filter(user =>
					message.guild.members.cache.get(user.id)?.permissions.has('ManageChannels'),
				).length;
			}
			else {
				modCount = Array.from(users.values()).filter(user =>
					message.guild.members.cache.get(user.id)?.permissions.has('ManageChannels') && (user.id !== message.author.id),
				).length;
			}
		}
	}
	return modCount;
}

async function handleModboard(message, modCount, payload) {
	const modboardChannelID = config.get_modboard_channel();
	const modboardChannel = await payload.client.channels.fetch(modboardChannelID);
	const onModboard = await modboardDB.check(payload.message.id);
	const trueCount = await getTrueCount(message);
	const threshold = await starboardSettingsDB.getThreshold(config.get_guild_id());
	if (modCount > 0 && trueCount < threshold) {
		if (!onModboard) {
			const modboardEmbed = await createModEmbed(message, modCount);
			const modboardMsg = await modboardChannel.send({ embeds: [modboardEmbed] });
			modboardDB.add(payload.message.id, modboardMsg.id);
		}
		else {
			const modboardMsgID = await modboardDB.get(payload.message.id);
			const modboardMsg = await modboardChannel.messages.fetch(modboardMsgID);
			const modboardEmbed = await createModEmbed(message, modCount);
			await modboardMsg.edit({ embeds: [modboardEmbed] });
		}
	}
	else if (onModboard) {
		const modboardMsgID = await modboardDB.get(payload.message.id);
		const modboardMsg = await modboardChannel.messages.fetch(modboardMsgID);
		if (!modboardMsg) {
			logger.warn('No modboard message foune');
		}
		await modboardMsg.delete();
		await modboardDB.remove(payload.message.id);
	}
}

async function createModEmbed(message, modCount) {
	const author = message.author;
	const authorName = author.tag;
	const authorUser = author.username;
	let msg = message.content;
	const footer = `⭐ by ${modCount} in #${message.channel.name}`;
	const title = authorName === authorUser ? authorName : `${authorUser} ~ ${authorName}`;
	msg = msg + `\n\n[⤴️ Go to message](${message.url})`;
	const modboardEmbed = new EmbedBuilder()
		.setAuthor({ name: title, iconURL: message.author.displayAvatarURL() })
		.setTimestamp(message.createdAt)
		.setFooter({ text: footer })
		.setDescription(`${msg}`);
	if (message.attachments.size > 0) {
		const firstAttachment = message.attachments.first();
		if (firstAttachment.contentType?.startsWith('image/')) {
			modboardEmbed.setImage(firstAttachment.url);
		}
	}
	return modboardEmbed;
}

async function addToStarboard(message, trueCount, starboardChannel) {
	const embed = createEmbed(message, trueCount);
	const starboardMsg = await starboardChannel.send({ embeds: [embed] });
	starboardDB.add(message.id, starboardMsg.id);
}

async function updateStarboard(message, trueCount, starboardChannel) {
	const starboardMsg = await starboardChannel.fetch(starboardDB.get(message.id));
	const embed = createEmbed(message, trueCount);
	await starboardMsg.edit({ embeds: [embed] });
}

async function removeFromStarboard(message, starboardChannel) {
	const starboardMsg = await starboardChannel.fetch(starboardDB.get(message.id));
	await starboardMsg.delete();
	starboardDB.remove(message.id);
}

async function createEmbed(message, count) {
	const author = message.author;
	const authorName = author.tag;
	const authorUser = author.username;
	let msg = message.content;
	msg += `\n\n[⤴️ Go to message](${message.url})`;
	const footer = `⭐ ${count} in #${message.channel.name}`;
	const title = authorName === authorUser ? authorName : `${authorUser} ~ ${authorName}`;
	const embed = new EmbedBuilder()
		.setAuthor({ name: title, iconURL: message.author.displayAvatarURL() })
		.setTimestamp(message.createdAt)
		.setFooter({ text: footer })
		.setDescription(msg);
	if (message.attachments.size > 0) {
		const firstAttachment = message.attachments.first();
		if (firstAttachment.contentType?.startsWith('image/')) {
			embed.setImage(firstAttachment.url);
		}
	}
	return embed;
}

module.exports = {
	getTrueCount,
	getModCount,
	handleModboard,
	createModEmbed,
	addToStarboard,
	updateStarboard,
	removeFromStarboard,
	createEmbed,
};