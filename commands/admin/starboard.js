const { SlashCommandBuilder, channelMention, PermissionFlagsBits, MessageFlags } = require('discord.js');
const { StarboardSettingsDB } = require('../../db/starboard');
const logger = require('../../utility/logger');

const starboardsettings_db = new StarboardSettingsDB();

const data = new SlashCommandBuilder()
     .setName('starboard')
     .setDescription("Starboard related settings")
     .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels)
     .addSubcommand(subcommand =>
        subcommand
             .setName("setthreshold")
             .setDescription("Set the threshold for starboard")
             .addIntegerOption(option => 
                option
                    .setName("threshold")
                    .setDescription("The threshold to set it to")
                    .setRequired(true)
                )
     )
     .addSubcommand(subcommand =>
        subcommand
             .setName("getthreshold")
             .setDescription("get the threshold for starboard")
     );

module.exports = {
    data,
    async execute(interaction) {
        if (interaction.options.getSubcommand() === 'setthreshold'){
            const threshold = interaction.options.getInteger('threshold');
            logger.info(`'/starboard setthreshold' was called by ${interaction.user.tag}. Threshold now: ${threshold}`)
            if (!await starboardsettings_db.check(interaction.guildId)){
                await starboardsettings_db.add(interaction.guildId, 0, threshold);
            }else{
                await starboardsettings_db.updateThreshold(interaction.guildId, threshold);
            }
            await interaction.reply({ content: `Starboard threshold set to ${threshold}`, flags: MessageFlags.Ephemeral});
        }else if(interaction.options.getSubcommand() === 'getthreshold'){
            logger.info(`'/starboard getthreshold' was called by ${interaction.user.tag}.`)
            var threshold = 0
            if (!await starboardsettings_db.check(interaction.guildId)){
                await starboardsettings_db.add(interaction.guildId, 0, 5)
                threshold = 5;
            }else{
                threshold = await starboardsettings_db.getThreshold(interaction.guildId)
            }
            
            await interaction.reply({ content:`Current Starboard threshold is ${threshold}`, flags: MessageFlags.Ephemeral})
            logger.info(`'/starboard getthreshold' result: ${threshold}`)
        }
    }
};