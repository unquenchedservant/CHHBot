const { SlashCommandBuilder, PermissionFlagsBits, MessageFlags } = require('discord.js');
const HolidayDB = require('../../db/holiday');
const logger = require('../../utility/logger');

const holiday_db = new HolidayDB();

const data = new SlashCommandBuilder()
	.setName('holidays')
	.setDescription('Holiday related settings')
	.setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels)
	.addSubcommand(subcommand =>
		subcommand
			.setName('add')
			.setDescription('Add a holiday to CHHBot\'s calendar')
			.addIntegerOption(option =>
				option
					.setName('month')
					.setDescription('Enter the month (1-12) this holiday occurs')
					.setRequired(true)
					.setMinValue(1)
					.setMaxValue(12),
			)
			.addIntegerOption(option =>
				option
					.setName('day')
					.setDescription('Enter the day(1-31) this holiday occurs')
					.setRequired(true)
					.setMinValue(1)
					.setMaxValue(31),
			)
			.addStringOption(option =>
				option
					.setName('message')
					.setDescription('What message would you like CHHBot to send on this day')
					.setRequired(true),
			),
	)
	.addSubcommand(subcommand =>
		subcommand
			.setName('remove')
			.setDescription('Remove a calendar from CHHBot\'s calendar')
			.addIntegerOption(option =>
				option
					.setName('month')
					.setDescription('Month (1-12) holiday occurs')
					.setRequired(true)
					.setMinValue(1)
					.setMaxValue(12),
			)
			.addIntegerOption(option =>
				option
					.setName('day')
					.setDescription('Day (1-31) holiday occurs')
					.setRequired(true)
					.setMinValue(1)
					.setMaxValue(31),
			),
	)
	.addSubcommand(subcommand =>
		subcommand
			.setName('check')
			.setDescription('Check a specific (or all) holidays')
			.addIntegerOption(option =>
				option
					.setName('month')
					.setDescription('Month (1-12) holiday occurs')
					.setRequired(false)
					.setMinValue(1)
					.setMaxValue(12),
			)
			.addIntegerOption(option =>
				option
					.setName('day')
					.setDescription('Day (1-31) holiday occurs')
					.setRequired(false)
					.setMinValue(1)
					.setMaxValue(31),
			),
	);

async function add_holiday(month, day, msg) {
	updated = await holiday_db.add(month, day, msg);
	const responseMsg = updated
		? `Successfully updated holiday message on ${month}/${day} with the message: ${msg}`
		: `Successfully saved a new holiday on ${month}/${day} with the message: ${msg}`;
	return responseMsg;
}

async function remove_holiday(month, day) {
	const status = holiday_db.remove(month, day);
	const responseMsg = status == 1
		? `Holiday on ${month}/${day} removed`
		: 'Holiday not removed, may not exist';
	return responseMsg;
}

async function check_holiday(interaction) {
	let responseMsg = '';
	const month = interaction.options.getInteger('month');
	const day = interaction.options.getInteger('day');
	if (month === null && day === null) {
		const holidays = await holiday_db.check_multi();
		if (holidays.length == 0) {
			await interaction.reply({ content: 'No holidays set, add a holiday with `/holiday add`', flags: MessageFlags.Ephemeral });
			responseMsg = 'No holidays set, add a holiday with `/holiday add`';
		}
		else {
			for (const holiday of holidays) {
				const { MONTH: mnth, DAY: dy, MSG: message } = holiday;
				responseMsg += `${mnth}/${dy} - ${message}\n\n`;
			}
			await interaction.reply(responseMsg);
		}

	}
	else if (month === null) {
		await interaction.reply({ content: 'Please enter the holiday month (1-12)', flags: MessageFlags.Ephemeral });
	}
	else if (day === null) {
		await interaction.reply({ content: 'Please enter the holiday day (1-31)', flags: MessageFlags.Ephemeral });
	}
	else {
		mesg = await holiday_db.check(month, day);
		if (mesg == 0) {
			await interaction.reply({ content: 'There is no holiday on that day', flags: MessageFlags.Ephemeral });
		}
		else {
			await interaction.reply({ content: `The message for ${month}/${day} is : ${mesg}` });
		}
	}
}
module.exports = {
	data,
	async execute(interaction) {
		if (interaction.options.getSubcommand() === 'add') {
			logger.info(`'/holiday add' was called by ${interaction.user.tag}`);
			const response = await add_holiday(interaction.options.getInteger('month'), interaction.options.getInteger('day'), interaction.options.getString('message'));
			await interaction.reply({ content: response, flags: MessageFlags.Ephemeral });
		}
		else if (interaction.options.getSubcommand() === 'remove') {
			logger.info(`'/holiday remove' was called by ${interaction.user.tag}`);
			const response = await remove_holiday(interaction.options.getInteger('month'), interaction.options.getInteger('day'));
			await interaction.reply({ content: response, flags: MessageFlags.Ephemeral });
		}
		else if (interaction.options.getSubcommand() === 'check') {
			logger.info(`'/holiday check' was called by ${interaction.user.tag}`);
			await check_holiday(interaction);
		}
	},
};