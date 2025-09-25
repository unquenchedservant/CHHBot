import logging
import logging.config
import utilities
from utilities import get_env
from utilities import Config

config = Config(True) # EDIT THIS LATER TO NOT HAVE A BOOLEAN
token = get_env.discord_token()
if token.endswith("B2M"):
    logfile = "chhbot-dev.log"
else:
    logfile = "chhbot.log"
logging.config.fileConfig("logging.conf", defaults={'logfilename': logfile})

logger = logging.getLogger()
if config.is_dev:
    logger.setLevel(logging.DEBUG)
else:
    logger.setLevel(logging.INFO)

def setLoggerLevel(is_dev):
    if is_dev:
        logger.setLevel(logging.DEBUG)
    else:
        logger.setLevel(logging.INFO)

