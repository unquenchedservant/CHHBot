const { is_dev } = require('./environment');


class Config {
	constructor() {
		this.ANN_DEV_ID = '471397293229342781';
		this.ANN_CHH_ID = '613469111682334762';

		this.DEV_ARCH_LVL_1_ID = '745644736341344276';
		this.DEV_ARCH_LVL_2_ID = '1383647619448045659';

		this.CHH_ARCH_LVL_1_ID = '615702601354182706';
		this.CHH_ARCH_LVL_2_ID = '845039809402634240';

		this.DEV_GUILD_ID = '365879579887534080';
		this.CHH_GUILD_ID = '613464665661636648';

		this.MODBOARD_DEV_ID = '1366483066494914634';
		this.MODBOARD_CHH_ID = '1366482618140459170';

		this.STARBOARD_DEV_ID = '1347392583050985612';
		this.STARBOARD_CHH_ID = '786775284484669460';

		this.SLFPRMO_DEV_ID = '1384235493931094136';
		this.SLFPRMO_CHH_ID = '705272855159635969';

		this.ROLEMENU_DEV_ID = '1342571477865730089';
		this.ROLEMENU_CHH_ID = '975067933673914388';

		this.RULES_DEV_ID = '1342581100123258952';
		this.RULES_CHH_ID = '844989137551228978';

		this.REPORT_DEV_ID = '957645821531258930';
		this.REPORT_CHH_ID = '705532389744705616';

		this.STICK_DEV_ID = '1384270923196272881';
		this.STICK_CHH_ID = '742919732478607460';

		this.WELCOME_CHANNEL_ID = '613468039010320415';
		this.ARTIST_ROLE_MENU_CHANNEL_ID = '616100468526940195';
		this.PARTNERS_CHANNEL_ID = '797240025653051402';
		this.MOD_LOG_CHANNEL_ID = '705478973651419167';
		this.BOT_COMMANDS_CHANNEL_ID = '702927203360571483';
		this.STAFF_HELP_CHANNEL_ID = '909151861892866158';
		this.STAFF_CHANNEL_ID = '705463143882686564';
		this.STAFF_BOT_CHANNEL_ID = '685566940122447887';
		this.STAFF_PARTNER_CHANNEL_ID = '832352549164154900';
		this.REDDIT_CHANNEL_ID = '700486332979609671';
		this.OWNER_ID = '236394260553924608';
	}

	get_stick_id() {
		return is_dev() ? this.STICK_DEV_ID : this.STICK_CHH_ID;
	}

	get_announcements_channel_id() {
		return is_dev() ? this.ANN_DEV_ID : this.ANN_CHH_ID;
	}

	get_archive_1_id() {
		return is_dev() ? this.DEV_ARCH_LVL_1_ID : this.CHH_ARCH_LVL_1_ID;
	}

	get_archive_2_id() {
		return is_dev() ? this.DEV_ARCH_LVL_2_ID : this.CHH_ARCH_LVL_2_ID;
	}

	get_guild_ids() {
		return is_dev() ? [this.DEV_GUILD_ID] : [this.CHH_GUILD_ID, this.DEV_GUILD_ID];
	}

	get_guild_id() {
		return is_dev() ? this.DEV_GUILD_ID : this.CHH_GUILD_ID;
	}

	get_starboard_channel() {
		return is_dev() ? this.STARBOARD_DEV_ID : this.STARBOARD_CHH_ID;
	}

	get_modboard_channel() {
		return is_dev() ? this.MODBOARD_DEV_ID : this.MODBOARD_CHH_ID;
	}

	get_self_promo_id() {
		return is_dev() ? this.SLFPRMO_DEV_ID : this.SLFPRMO_CHH_ID;
	}

	get_role_menu_id() {
		return is_dev() ? this.ROLEMENU_DEV_ID : this.ROLEMENU_CHH_ID;
	}

	get_rules_id() {
		return is_dev() ? this.RULES_DEV_ID : this.RULES_CHH_ID;
	}

	get_admin_id() {
		return is_dev() ? this.REPORT_DEV_ID : this.REPORT_CHH_ID;
	}

	get_report_id() {
		return is_dev() ? this.REPORT_DEV_ID : this.REPORT_CHH_ID;
	}

	get_staff_id() {
		return this.STAFF_CHANNEL_ID;
	}

	get_staff_help_id() {
		return this.STAFF_CHANNEL_ID;
	}

	get_welcome_id() {
		return this.WELCOME_CHANNEL_ID;
	}

	get_artist_role_menu_id() {
		return this.ARTIST_ROLE_MENU_CHANNEL_ID;
	}

	get_partners_id() {
		return this.PARTNERS_CHANNEL_ID;
	}

	get_mod_log_id() {
		return this.MOD_LOG_CHANNEL_ID;
	}

	get_bot_commands_id() {
		return this.BOT_COMMANDS_CHANNEL_ID;
	}

	get_staff_bot_id() {
		return this.STAFF_BOT_CHANNEL_ID;
	}

	get_staff_partner_id() {
		return this.STAFF_PARTNER_CHANNEL_ID;
	}

	get_reddit_channel_id() {
		return this.REDDIT_CHANNEL_ID;
	}

	get_owner_id() {
		return this.OWNER_ID;
	}
}

module.exports = new Config();