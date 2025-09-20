from db import Database

class HolidayDB(Database):
    def __init__(self):
        super().__init__()
        self.create()

    def create(self):
        self.execute('''CREATE TABLE IF NOT EXISTS holidays
                     (MONTH INT NOT NULL,
                     DAY INT NOT NULL,
                     MSG VARCHAR(2000) NOT NULL)''')
        
    def add(self, month, day, msg):
        data = self.execute("SELECT * FROM holidays WHERE MONTH={} AND DAY={}".format(month,day))
        updated = False
        if len(data) == 0:
            sql = "INSERT INTO holidays (MONTH, DAY, MSG) VALUES ({},{},\"{}\")".format(month,day,msg)
        else:
            updated = True
            sql = "UPDATE holidays SET MSG='{}' WHERE MONTH={} AND DAY={}".format(msg, month, day)
        self.execute(sql)
        return updated

    def check(self, month, day):
        data = self.execute("SELECT MSG FROM holidays WHERE MONTH={} AND DAY={}".format(month,day))
        if len(data) == 0:
            return 0
        else:
            return data[0][0]

    def check_multi(self):
        return self.execute("SELECT * FROM holidays")

    def remove(self, month, day):
        data = self.execute("SELECT * FROM holidays WHERE MONTH={} AND DAY={}".format(month,day))
        if len(data) == 0:
            return 0
        else:
            self.execute("DELETE FROM holidays WHERE MONTH={} AND DAY={}".format(month,day))
            return 1