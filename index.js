const { validateEnv } = require('./utility/environment');
validateEnv();
const fs = require('node:fs');
const path = require('node:path');
const db = require('./db/database');



const logger = require('./utility/logger');

const { Client, Collection, GatewayIntentBits, Partials } = require('discord.js');
const dotenv = require('dotenv');

dotenv.config();

const token = process.env.DISCORD_TOKEN;

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMessageReactions,
  ],
  partials: [
    Partials.Message,
    Partials.Reaction,
  ],
});

client.commands = new Collection();

const foldersPath = path.join(__dirname, 'commands');
const commandFolders = fs.readdirSync(foldersPath);

for (const folder of commandFolders) {
  const commandsPath = path.join(foldersPath, folder);
  const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
  for (const file of commandFiles) {
    const filePath = path.join(commandsPath, file);
    const command = require(filePath);

    if ('data' in command && 'execute' in command) {
      client.commands.set(command.data.name, command);
    }
    else {
      logger.warn(`The command at ${filePath} is missing a required "data" or "execute" property.`);
    }
  }
}

const eventsPath = path.join(__dirname, 'events');
const eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith('.js'));

for (const file of eventFiles) {
  const filePath = path.join(eventsPath, file);
  const event = require(filePath);
  if (event.once) {
    client.once(event.name, (...args) => event.execute(...args));
  }
  else {
    client.on(event.name, (...args) => event.execute(...args));
  }
}

client.login(token);

// Graceful shutdown: close Discord client and DB on signals/errors
async function gracefulShutdown(code = 0) {
  try {
    logger.info('Graceful shutdown initiated');
    if (client) {
      try { await client.destroy(); } catch (err) { logger.error(`Error destroying client: ${err}`); }
    }
  }
  finally {
    try {
      await db.close();
    } catch (err) {
      logger.error(`Error closing database: ${err}`);
    }
    process.exit(code);
  }
}

process.on('SIGINT', () => gracefulShutdown(0));
process.on('SIGTERM', () => gracefulShutdown(0));

process.on('uncaughtException', (err) => {
  logger.error(`Uncaught Exception: ${err.stack || err}`);
  // attempt graceful shutdown with non-zero exit
  gracefulShutdown(1);
});

process.on('unhandledRejection', (reason) => {
  logger.error(`Unhandled Rejection: ${reason}`);
  gracefulShutdown(1);
});
