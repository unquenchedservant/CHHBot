from db import Database

class VAReleasesDB(Database):

    def __init__(self):
        super().__init__()
        self.create()

    def create(self):
        self.execute('''CREATE TABLE IF NOT EXISTS vareleases
                    (ID INT PRIMARY KEY AUTOINCREMENT,
                     UserID INT NOT NULL,
                     UserName VARCHAR(100) NOT NULL,
                     ReleaseDate VARCHAR(12) NOT NULL,
                     Type VARCHAR(10) NOT NULL,
                     Link VARCHAR(200) NOT NULL)''')