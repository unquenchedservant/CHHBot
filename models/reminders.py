from models import Database

'''
Jotterpad

Fields: 
- ID - ID of the reminder
- UID - user id who requested reminder
- Uname - use the template in openai for getting name, but user name who requested the reminder
- reminder - text of the reminder
- datetime - timestamp of when they want to be reminded, translated to UTC. 
- private - boolean. If private, DM
'''

class Reminders(Database):
    def __init__(self):
        super().__init__()
        self.create()

    def create(self):
        self.execute('''CREATE TABLE IF NOT EXISTS reminders
                    (UID INT NOT NULL,
                    RID INT NOT NULL)''')
        
    def add(self, user_id, role_id):
        self.execute("INSERT INTO reminders (UID, RID) VALUES ({},{})".format(user_id, role_id))

    def get(self, user_id):
        data = self.execute("SELECT * FROM reminders WHERE UID={}".format(user_id))
        roles = []
        for item in data:
            roles.append(item[1])
        return roles

    def remove(self, user_id):
        self.execute("DELETE FROM reminders WHERE UID={}".format(user_id))