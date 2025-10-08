const { Events, EmbedBuilder } = require('discord.js');
const logger = require('../utility/logger');
const Scheduler = require('../utility/scheduler');
const config = require('../utility/config');
const HolidayDB = require('../db/holiday');
const BirthdayDB = require('../db/birthday');
const VAReleasesDB = require('../db/vareleases');
const ArchivalDB = require('../db/archival');
const { checkMonth } = require('../utility/dateutils');

const holidayDB = new HolidayDB();
const birthdayDB = new BirthdayDB();
const vaReleasesDB = new VAReleasesDB();
const archivalDB = new ArchivalDB();

async function channelMove(channel, level, guild) {
  let newCategoryId = 0;
  if (level === 1) {
    newCategoryId = config.getArchive1ID();
  }
  else if (level === 2) {
    newCategoryId = config.getArchive2ID();
  }
  try {
    const category = await guild.channels.fetch(newCategoryId);
    if (!category) {
      logger.error(`Could not find category with ID: ${newCategoryId}`);
      return;
    }
    await channel.setParent(category.id, { lockPermissions: true });
    logger.info (`Moved channel ${channel.name} to category ${category.name}`);
  }
  catch (error) {
    logger.error(`Failed to move channel: ${error}`);
  }
}

async function getChannels(currentMonth, checkDay, modifier = 0) {
  const chMonth = checkMonth(currentMonth - modifier);
  const channels = await archivalDB.getChannels(chMonth, checkDay);
  if (channels) {
    const returnChannels = [];
    for (const channel of channels) {
      returnChannels.push(channel.CHANNELID);
    }
    return returnChannels;
  }
  return false;
}

async function handleArchives(client) {
  logger.info('Handling Archives');
  const currentMonth = new Date().getMonth() + 1;
  const currentDay = new Date().getDate();

  const guild = await client.guilds.fetch(config.getGuildID());

  const threeChannels = await getChannels(currentMonth, currentDay, 3);
  if (threeChannels) {
    for (const channel of threeChannels) {
      await archivalDB.update(channel, 2);
      const realChannel = await guild.channels.fetch(channel);
      await channelMove(realChannel, 2, guild);
    }
  }
  const sixChannels = await getChannels(currentMonth, currentDay, 9);
  if (sixChannels) {
    for (const channel of sixChannels) {
      const realChannel = await guild.channels.fetch(channel);
      if (realChannel) {
        await archivalDB.remove(realChannel);
        await realChannel.delete();
      }
    }
  }
  return;
}

async function handleReleases(client) {
  logger.info('Handling releases');
  const today = new Date();
  const checkDay = `${today.getMonth() + 1}/${today.getDate()}/${today.getFullYear().toString().slice(-2)}`;
  const releases = await vaReleasesDB.getByDate(checkDay);
  if (vaReleasesDB.checkLen(releases)) {
    const embed = new EmbedBuilder()
      .setTitle('New Release(s) Today');
    for (const release of releases) {
      const userId = release.UserID;
      const title = release.ReleaseTitle;
      const desc = release.Desc;
      const rType = release.Type;
      const link = release.Link;
      const linkText = link != 'None' ? `[Link](${link})` : 'None';

      const fieldValue = `**Artist:** <@${userId}>\n**Type:** ${rType}\n**Description:** ${desc}\n**Link:** ${linkText}`;
      embed.addFields(
        { name: `${title}`, value: fieldValue },
      );
    }
    const annCh = await client.channels.fetch(config.getAnnouncementsID());
	    await annCh.send({ embeds: [embed] });
  }
  return;
}

async function handleHoliday(client) {
  logger.info('Handling Holidays');
  const currentMonth = new Date().getMonth() + 1;
  const currentDay = new Date().getDate();
  const holidayMsg = await holidayDB.check(currentMonth, currentDay);
  if (holidayMsg && !(currentMonth === 1 && currentDay === 16)) {
    const annCh = await client.channels.fetch(config.getAnnouncementsID());
	    await annCh.send({ content: holidayMsg });
  }
}

async function handleBirthday(client) {
  logger.info('Handling birthdays');
  const currentMonth = new Date().getMonth() + 1;
  const currentDay = new Date().getDate();

  const birthdayIDs = await birthdayDB.check(currentMonth, currentDay);
  let msg = '';
  if (birthdayIDs.length > 0) {
    logger.info('Birthdays found, making announcement post');
    msg = 'We\'ve got a birthday! Make sure to wish the following people a happy birthday:\n';
    for (const id of birthdayIDs) {
      msg += `<@${id}>\n`;
    }
    msg += '\nWant a message for your birthday? use `/birthday set`';
    const annCh = await client.channels.fetch(config.getAnnouncementsID());
	    await annCh.send({ content: msg });
  }
  else {
    logger.info(`No Birthdays for ${currentMonth}/${currentDay}`);
  }
}

async function handleOneOneSix(client) {
  logger.info('Handling 1/16');
  const annCh = await client.channels.fetch(config.getAnnouncementsID());
  let msg = await holidayDB.check(1, 16);
  if (!msg) {
    msg = 'LET ME HEAR YOU SHOUT 1 1 6!\nHappy 116 Day, everyone!';
  }
  await annCh.send({ content: msg });
}

module.exports = {
  name: Events.ClientReady,
  once: true,
  execute(client) {
    logger.info(`Ready! Logged in as ${client.user.tag}`);
    const scheduler = new Scheduler(client);

    scheduler.scheduleDaily(async () => {
      await handleArchives(client);
      await handleReleases(client);
      await handleHoliday(client);
    }, '0 0 * * *');

    scheduler.scheduleDaily(async () => {
      await handleBirthday(client);
    }, '0 8 * * *');

    scheduler.scheduleDaily(async () => {
      await handleOneOneSix(client);
    }, '16 13 16 1 *');
  },
};