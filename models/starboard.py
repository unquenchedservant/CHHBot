from models import Database

class StarboardDB(Database):
    def __init__(self):
        super().__init__()
        self.create()
    
    def create(self):
        self.execute('''CREATE TABLE IF NOT EXISTS starboard
                              (MSGID INT NOT NULL,
                               STARBOARDMSGID INT NOT NULL)''')
        
    def add(self, msg_id, starboard_msg_id):
        self.execute("INSERT INTO starboard (MSGID, STARBOARDMSGID) VALUES ({},{})".format(msg_id, starboard_msg_id))

    def get(self, msg_id):
        data = self.execute("SELECT STARBOARDMSGID FROM starboard WHERE MSGID={}".format(msg_id))
        return data[0][0]
    
    def update(self,msg_id,starboard_msg_id):
        self.execute("UPDATE starboard SET STARBOARDMSGID={} WHERE MSGID={}".format(starboard_msg_id, msg_id))

    def check(self,msg_id):
        data = self.execute("SELECT * FROM starboard WHERE MSGID={}".format(msg_id))
        return self.check_len(data)
    
    def remove(self,msg_id):
        self.execute("DELETE FROM starboard WHERE MSGID={}".format(msg_id))
    
    def drop(self):
        self.execute("DROP TABLE starboard")

class Modboard(Database):
    def __init__(self):
        super().__init__()
        self.create()
    
    def create(self):
        self.execute('''CREATE TABLE IF NOT EXISTS modboard
                    (MSGID INT NOT NULL,
                    MODBOARDMSGID INT NOT NULL)''')
        
    def add(self, msg_id, modboard_msg_id):
        self.execute("INSERT INTO modboard (MSGID, MODBOARDMSGID) VALUES ({},{})".format(msg_id, modboard_msg_id))
        
    def check(self, msg_id):
        data = self.execute("SELECT * FROM modboard WHERE MSGID={}".format(msg_id))
        return self.check_len(data)
    
    def get(self, msg_id):
        data = self.execute("SELECT MODBOARDMSGID FROM modboard WHERE MSGID={}".format(msg_id))
        return data[0][0]
    
    def update(self, msg_id, modboard_msg_id):
        self.execute("UPDATE modboard SET MODBOARDMSGID={} WHERE MSGID={}".format(modboard_msg_id, msg_id))

    def remove(self, msg_id):
        self.execute("DELETE FROM modboard WHERE MSGID={}".format(msg_id))

    def drop(self):
        self.execute("DROP TABLE modboard")

class StarboardSettings(Database):
    def __init__(self):
        super().__init__()
        self.create()

    def create(self):
        self.execute('''CREATE TABLE IF NOT EXISTS starboardsettings
                    (GUILDID INT NOT NULL,
                    STARBOARDCHANNEL INT NOT NULL,
                    STARBOARDTHRESHOLD INT NOT NULL)''')
        
    def add(self, guild_id, starboard_channel, starboard_threshold):
        self.execute("INSERT INTO starboardsettings (GUILDID, STARBOARDCHANNEL, STARBOARDTHRESHOLD) VALUES ({},{},{})".format(guild_id, starboard_channel, starboard_threshold))

    def check(self, guild_id):
        data = self.execute("SELECT * FROM starboardsettings WHERE GUILDID={}".format(guild_id))
        return self.check_len(data)

    def update_channel(self, guild_id, starboard_channel):
        self.execute("UPDATE starboardsettings SET STARBOARDCHANNEL={} WHERE GUILDID={}".format(starboard_channel, guild_id))
    
    def update_threshold(self, guild_id, starboard_threshold):
        self.execute("UPDATE starboardsettings SET STARBOARDTHRESHOLD={} WHERE GUILDID={}".format(starboard_threshold, guild_id))

    def get_settings(self, guild_id):
        data = self.execute("SELECT STARBOARDCHANNEL, STARBOARDTHRESHOLD FROM starboardsettings WHERE GUILDID={}".format(guild_id))
        return data[0]

    def get_threshold(self, guild_id):
        data = self.execute("SELECT STARBOARDTHRESHOLD FROM starboardsettings WHERE GUILDID={}".format(guild_id))
        return data[0][0]

    def remove(self, guild_id):
        self.execute("DELETE FROM starboardsettings WHERE GUILDID={}".format(guild_id))

    def drop(self):
        self.execute("DROP TABLE starboardsettings")