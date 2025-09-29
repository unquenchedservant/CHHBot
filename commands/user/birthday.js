const { SlashCommandBuilder, channelMention, PermissionFlagBits, MessageFlags } = require('discord.js');
const BirthdayDB  = require('../../db/birthday')
const logger = require('../../utility/logger');

const birthday_db = new BirthdayDB();

const data = new SlashCommandBuilder()
    .setName('birthday')
    .setDescription("CHHBot will let the server know when it's your birthday!")
    .addSubcommand(subcommand => 
        subcommand
        .setName("set")
        .setDescription("Set your birthday")
        .addIntegerOption(option =>
            option
            .setName("month")
            .setDescription("Month your birthday occurs")
            .setMinValue(1)
            .setMaxValue(12)
            .setRequired(true)
        )
        .addIntegerOption(option =>
            option
            .setName("day")
            .setDescription("Day your birthday occurs")
            .setMinValue(1)
            .setMaxValue(31)
            .setRequired(true)
        )
    )
    .addSubcommand(subcommand => 
        subcommand
        .setName("check")
        .setDescription("Check what day (if any) you have set")
    )
    .addSubcommand(subcommand => 
        subcommand
        .setName("remove")
        .setDescription("Remove your birthday from our database")
    )

module.exports = {
    data,
    async execute(interaction) {
        if (interaction.options.getSubcommand() === 'set'){
            logger.info(`'/birthday set' called by ${interaction.user.tag}`)
            await birthday_db.set(interaction.user.id, interaction.options.getInteger('month'), interaction.options.getInteger('day'))
            await interaction.reply({content: `Your birthday has been set to ${interaction.options.getInteger("month")}/${interaction.options.getInteger("day")} successfully`, flags: MessageFlags.Ephemeral })
            logger.info(`${interaction.user.tag} set birthday to ${interaction.options.getInteger("month")}/${interaction.options.getInteger("day")}`)
        }else if(interaction.options.getSubcommand() === 'check'){
            logger.info(`'/birthday check' called by ${interaction.user.tag}`)
            const birthday = await birthday_db.get(interaction.user.id)
            if (birthday == [0,0]){
                await interaction.reply({ content: "You do not have a birthday set, use `/setbirthday` to do so", flags: MessageFlags.Ephemeral})
            }else{
                await interaction.reply({ content: `Your birthday is set to ${birthday.MONTH}/${birthday.DAY}`, flags: MessageFlags.Ephemeral })
            }
        }else if(interaction.options.getSubcommand() === 'remove'){
            logger.info(`'/birthday remove' called by ${interaction.user.tag}`)
            await birthday_db.remove(interaction.user.id)
            await interaction.reply({ content: "Your birthday has been removed successfully", flags: MessageFlags.Ephemeral })
        }
    }
}