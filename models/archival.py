from models import Database

class Archival(Database):
    def __init__(self):
        super().__init__()
        self.create()

    def create(self):
        self.execute('''CREATE TABLE IF NOT EXISTS archival
                 (CHANNELID INT NOT NULL,
                 MONTH INT NOT NULL,
                 DAY INT NOT NULL,
                 LEVEL INT NOT NULL)''')
        
    def get_channels(self, month, day):
        data = self.execute("SELECT CHANNELID FROM archival WHERE MONTH={} AND DAY={}".format(month,day))
        return False if len(data) == 0 else data
        
    def get_level(self, channel_id):
        data = self.execute("SELECT LEVEL FROM archival WHERE CHANNELID={}".format(channel_id))
        if len(data) == 0:
            return False
        else:
            return data
        
    def check(self, channel_id):
        data = self.execute("SELECT * FROM archival WHERE CHANNELID={}".format(channel_id))
        return data
    
    def set(self, channel_id, month, day, level):
        self.execute("INSERT INTO archival (CHANNELID,MONTH,DAY,LEVEL) VALUES ({},{},{},{})".format(channel_id, month, day,level))

    def update(self, channel_id, level=None, month=None, day=None):
        if level and month and day:
            self.execute("UPDATE archival SET LEVEL={}, MONTH={}, DAY={} WHERE CHANNELID={}".format(level, month, day, channel_id))
        elif level and month:
            self.execute("UPDATE archival SET LEVEL={}, month={} WHERE CHANNELID={}".format(level, month, channel_id))
        elif level:
            self.execute("UPDATE archival SET LEVEL={} WHERE CHANNELID={}".format(level, channel_id))
        elif month:
            self.execute("UPDATE archival SET MONTH={} WHERE CHANNELID={}".format(month, channel_id))

    def remove(self, channel_id):
        self.execute("DELETE FROM archival WHERE CHANNELID='{}'".format(channel_id))
    
    def drop(self):
        self.execute("DROP TABLE archival")