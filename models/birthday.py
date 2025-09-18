from models import Database

class Birthday(Database):
    def __init__(self):
        super().__init__()
        self.create()

    def create(self):
        self.execute('''CREATE TABLE IF NOT EXISTS birthdays
                    (USERID INT NOT NULL,
                    MONTH INT NOT NULL,
                    DAY INT NOT NULL,
                    ACTIVE INT NOT NULL)''')
    
    def get(self, user_id):
        data = self.execute("SELECT * FROM birthdays WHERE USERID={}".format(user_id))
        if len(data) == 0:
            return [0, 0]
        else:
            return [data[0][1], data[0][2]]

    def get_multi(self):
        data = self.execute("SELECT USERID FROM birthdays")
        rpkg = []
        for item in data:
            rpkg.append(item[0])
        return rpkg
    
    def set(self, user_id, month, day):
        data = self.execute("SELECT * FROM birthdays WHERE USERID={}".format(user_id))
        if len(data) == 0:
            sql = "INSERT INTO birthdays (USERID, MONTH, DAY, ACTIVE) VALUES ({},{},{},{})".format(user_id, month, day, 1)
        else:
            sql = "UPDATE birthdays SET MONTH={}, DAY={}, ACTIVE={} WHERE USERID={}".format(month, day, 1, user_id)
        self.execute(sql)

    def set_active(self, is_active, user_id):
        if is_active:
            isactive_int = 1
        else:
            isactive_int = 0
        self.execute("UPDATE birthdays SET ACTIVE={} WHERE USERID={}".format(isactive_int, user_id))

    def check(self, month, day):
        data = self.execute("SELECT USERID, ACTIVE FROM birthdays WHERE MONTH={} AND DAY={}".format(month, day))
        if len(data) == 0:
            return []
        else:
            birthday_ids = []
            for item in data:
                if item[1] == 1 or item[1] == None:
                    birthday_ids.append(item[0])
            return birthday_ids

    def remove(self, user_id):
        self.execute("DELETE FROM birthdays WHERE USERID={}".format(user_id))