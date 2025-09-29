const { MessageFlags, ContextMenuCommandBuilder, ApplicationCommandType, EmbedBuilder } = require("discord.js");
const SelfPromoMsgDB = require('../../db/selfpromo');
const logger = require('../../utility/logger');
const config = require('../../utility/config');

const selfpromomsgdb = new SelfPromoMsgDB();


const data = new ContextMenuCommandBuilder()
    .setName('Mark Self-Promo')
    .setType(ApplicationCommandType.Message);

async function check_validity(interaction, user, type) {
    const userRoles = interaction.member.roles.cache.map(role => role.name.toLowerCase());
    if(userRoles.includes('verified artist')){
        logger.info(`Self-Promo report (${type}) - Verified Artist | No Action`)
        await interaction.reply({content: "Thank you for the report, but this is a verified artist",flags: MessageFlags.Ephemeral})
        return false
    }else if(userRoles.includes('mod')){
        logger.info(`Self-Promo report (${type}) - Mod | No Action`);
        await interaction.reply({content: "Thank you for the report, but this is a mod.", flags: MessageFlags.Ephemeral})
        return false
    }else if(userRoles.includes('admin')){
        logger.info(`Self-Promo report (${type}) - Admin | No Action`);
        await interaction.reply({content: "Thank you for the report, but this is an admin.", flags: MessageFlags.Ephemeral})
        return false
    }else if(user.bot){
        if(user.id===701044392378499152 || user.id===436692846242955264){
            logger.info(`Self-Promo report (${type}) - CHH Bot | Put on blast`)
            await interaction.reply({content: "You thought."})
        }else{
            logger.info(`Self-Promo report (${type}) - Bot | No Action`)
            await interaction.reply({content: "Thank you for the report, but this is a bot.", flags:MessageFlags.Ephemeral})
        }
        return false
    }else{
        return true
    }
}

module.exports = {
    data, 
    async execute(interaction){
        logger.debug("CHECK CHECK")
        const user = interaction.targetMessage.author;
        const valid = await check_validity(interaction, user, "App")
        if(!valid) return 0;
        await selfpromomsgdb.add(interaction.targetMessage.id)
        let msg = `Woah there, <@${interaction.targetMessage.author.id}>,`
        msg += ` it looks like you're sharing self-promotion outside of <#${config.get_self_promo_id()}>!\n\n`
        msg += "If you don't have access to that channel, please stick around and get to know us a bit. Shortly after you join you will gain access. \n\n"
        msg += `In the meantime, check out <#${config.get_role_menu_id()}> and assign yourself the Artist/Producer tag to unlock some extra channels. Please take a minute to check out our <#${config.get_rules_id()}>\n\n`
        msg += "If you feel you should be a verified artist (who can self promo anywhere) feel free to reach out to the mods. Requirements: 50,000 streams on a single song *or* 10,000 monthly streams.\n\n"
        msg += "If we don't know who you are, we likely won't care about your music."

        const embed = new EmbedBuilder()
        .setTitle("Please Don't Self-Promo")
        .setDescription(msg)

        const replyMsg = await interaction.targetMessage.reply({embeds: [embed]})
        const report_channel = await interaction.client.channels.cache.get(config.get_report_id())
        await interaction.reply({ content: "Thanks, we let the user know about our self-promotion rules", flags: MessageFlags.Ephemeral })
        const reportMsg = `The following message was tagged for self-promotion by <@${interaction.user.id}:\n${interaction.targetMessage.url}\n`
        await report_channel.send(reportMsg)
    }
}