from models import Database

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