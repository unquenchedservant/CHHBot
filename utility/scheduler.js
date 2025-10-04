const cron = require('node-cron');
const logger = require('./logger');

class Scheduler {
	constructor(client) {
		this.client = client;
	}

	scheduleDaily(task, time = '0 0 * * *') {
		if (!cron.validate(time)) {
			logger.error(`Invalid cron expression: ${time}`);
			return;
		}

		cron.schedule(time, async () => {
			try {
				await task(this.client);
				logger.info(`Scheduled task executed at ${new Date().toISOString()}`);
			}
			catch (error) {
				logger.error(`Error in scheduled task: ${error}`);
			}
		});
	}
}

module.exports = Scheduler;