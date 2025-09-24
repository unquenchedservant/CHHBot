from db import Database

class RoleMemoryDB(Database):
    def __init__(self):
        super().__init__()
        self.create()

    def create(self):
        self.execute('''CREATE TABLE IF NOT EXISTS roleMemoryEnabled
                    (GUILDID INT NOT NULL,
                    ENABLED INT NOT NULL)''')
        
    def check(self, guild_id):
        data = self.execute("SELECT * FROM roleMemoryEnabled WHERE GUILDID={}".format(guild_id))
        if not len(data) == 0:
            return data[0][1]
        else:
            return 0

    def toggle(self, guild_id):
        data = self.execute("SELECT * FROM roleMemoryEnabled WHERE GUILDID={}".format(guild_id))
        newEnabled = 1
        if not len(data) == 0:
            if data[0][1] == 0:
                newEnabled = 1
            if data[0][1] == 1:
                newEnabled = 0
            self.execute("UPDATE roleMemoryEnabled SET ENABLED={} WHERE GUILDID={}".format(newEnabled, guild_id))
        else:
            self.execute("INSERT INTO roleMemoryEnabled (GUILDID, ENABLED) VALUES ({},{})".format(guild_id, 1))

    def get(self, guild_id):
        data = self.execute("SELECT * FROM roleMemoryEnabled WHERE GUILDID={}".format(guild_id))
        if len(data) == 0:
            return False
        else:
            if data[0][1] == 1:
                return True
            else:
                return False
            
class RoleDB(Database):
    def __init__(self):
        super().__init__()
        self.create()

    def create(self):
        self.execute('''CREATE TABLE IF NOT EXISTS roles
                    (UID INT NOT NULL,
                    RID INT NOT NULL)''')
        
    def add(self, user_id, role_id):
        self.execute("INSERT INTO roles (UID, RID) VALUES ({},{})".format(user_id, role_id))

    def get(self, user_id):
        data = self.execute("SELECT * FROM roles WHERE UID={}".format(user_id))
        roles = []
        for item in data:
            roles.append(item[1])
        return roles

    def remove(self, user_id):
        self.execute("DELETE FROM roles WHERE UID={}".format(user_id))