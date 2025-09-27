const { SlashCommandBuilder, PermissionFlagsBits, MessageFlags } = require('discord.js')
const { BirthdayDB } = require('../../db/birthday')

const birthday_db = new BirthdayDB();

const data = new SlashCommandBuilder()
    .setName('checkbirthday')
    .setDescription("check any user to see if they have a birthday set")
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels)
    .addUserOption(option =>
        option
        .setName("user")
        .setDescription("User to check")
        .setRequired(true)
    )

module.exports = {
    data, 
    async execute(interaction){
        logger.info(`'/checkbirthday' was called by ${interaction.user.name}`)
        let birthday = birthday_db.get(interaction.options.getUser('user').id)
        if (birthday == [0,0]){
            await interaction.reply({ content: "User does not have a birthday set", flags: MessageFlags.Ephemeral})
        }else{
            await interaction.reply({ content: `${interaction.options.getUser('user').name} birthday is set to ${birthday[0]}/${birthday[1]}`, flags: MessageFlags.Ephemeral})
        }
    }
}