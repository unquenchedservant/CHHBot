from db import Database

'''
Jotterpad

Fields: 
- ID - ID of the reminder
- UID - user id who requested reminder
- Uname - use the template in openai for getting name, but user name who requested the reminder
- reminder - text of the reminder
- channel_id - id of the channel
- datetime - timestamp of when they want to be reminded, translated to UTC. 
- private - boolean. If private, DM
'''



class RemindersDB(Database):
    def __init__(self):
        super().__init__()
        self.create()

    def create(self):
        self.execute('''CREATE TABLE IF NOT EXISTS reminders
                    (ID INTEGER PRIMARY KEY AUTOINCREMENT,
                     UserID INT NOT NULL,
                     Username VARCHAR(32) NOT NULL,
                     Reminder VARCHAR(350) NOT NULL,
                     ReminderTime DATETIME NOT NULL,
                     isPrivate BOOLEAN NOT NULL)''')
        
    def add(self, user_id, user_name, reminder, reminderTime, isPrivate):
        self.execute("INSERT INTO reminders (UserID, Username, Reminder, ReminderTime, isPrivate) VALUES ({},{},{},{},{})".format(user_id, user_name, reminder, reminderTime, isPrivate))

    def get_for_user(self, user_id):
        data = self.execute("SELECT * FROM reminders WHERE UserID={}".format(user_id))
        reminders = []
        for item in data:
            print(item)
            reminders.append(item[1])
        return reminders
    
    def get_for_date(self, reminderTime):
        data = self.execute("SELECT * FROM reminders WHERE ReminderTime={}".format(reminderTime))
        reminders = []
        for item in data:
            print(item)
            reminders.append(item[1])
        return reminders
    
    def remove(self, user_id):
        self.execute("DELETE FROM reminders WHERE UID={}".format(user_id))