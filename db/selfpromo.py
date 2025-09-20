from db import Database

class SelfPromoMsgDB(Database):
    def __init__(self):
        super().__init__()
        self.create()

    def create(self):
        self.execute('''CREATE TABLE IF NOT EXISTS selfpromomsg
                    (msgID INT NOT NULL)''')
        
    def add(self, msg_id):
        self.execute("INSERT INTO selfpromomsg (msgID) VALUES ({})".format(msg_id))
    
    def check(self, msg_id):
        data = self.execute("SELECT * FROM selfpromomsg WHERE msgID={}".format(msg_id))
        return self.check_len(data)