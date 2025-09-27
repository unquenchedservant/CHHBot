const { SlashCommandBuilder, channelMention } = require('discord.js');

const data = new SlashCommandBuilder()
     .setName('starboard')
     .setDescription("Starboard related settings")
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
             .setName("setchannel")
             .setDescription("Set the channel for starboard")
             .addChannelOption(option => 
                option
                    .setName("channel")
                    .setDescription("The channel you want starboard to be")
                    .setRequired(true)
                )
     );

module.exports = {
    data,
    async execute(interaction) {
        if (interaction.options.getSubcommand() === 'setthreshold'){
            const threshold = interaction.options.getInteger('threshold');
            //update DB here
            await interaction.reply(`Starboard threshold set to ${threshold}`);
        }else if(interaction.options.getSubcommand() === 'setchannel'){
            const channel = interaction.options.getChannel("channel");
            //update DB here
            await interaction.reply(`Starboard channel set to ${channelMention(channel.id)}`)
        }
    }
};