const { REST, Routes } = require('discord.js');
const dotenv = require('dotenv');
const fs = require('node:fs');
const path = require('node:path');
const logger = require('./utility/logger');

dotenv.config();

const token = process.env.DISCORD_TOKEN;
const clientId = process.env.CLIENT_ID;
const guildId = process.env.GUILD_ID;

const commands = [];

const foldersPath = path.join(__dirname, 'commands');
const commandFolders = fs.readdirSync(foldersPath);

for (const folder of commandFolders) {
  const commandsPath = path.join(foldersPath, folder);
  const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

  for (const file of commandFiles) {
    const filePath = path.join(commandsPath, file);
    const command = require(filePath);
    if ('data' in command && 'execute' in command) {
      if (command.data.toJSON) {
        commands.push(command.data.toJSON());
      }
      else if (command.data.slash) {
        commands.push(command.data.slash);
        if (command.data.context) {
          commands.push(command.data.context);
        }
      }
      else {
        commands.push(command.data);
      }
    }
    else {
      logger.info(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
    }
  }

}
logger.info('Deploying commands:');
commands.forEach(cmd => {
  logger.info(`- ${cmd.name} (${cmd.type})`);
});

const rest = new REST().setToken(token);

(async () => {
  try {
    logger.info(`Started refreshing ${commands.length} application (/).`);

    const data = await rest.put(
      Routes.applicationGuildCommands(clientId, guildId),
      { body: commands },
    );

    logger.info(`Successfully reloaded ${data.length} application (/) commands.`);
  }
  catch (error) {
    logger.error(error);
  }
})();