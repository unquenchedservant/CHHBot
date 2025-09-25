from db import Database
import sqlite3

class VAReleasesDB(Database):

    def __init__(self):
        super().__init__()
        self.create()

    def create(self):
        self.execute('''CREATE TABLE IF NOT EXISTS vareleases
                    (ID INTEGER PRIMARY KEY AUTOINCREMENT,
                     UserID INTEGER NOT NULL,
                     UserName VARCHAR(100) NOT NULL,
                     ReleaseTitle VARCHAR(100) NOT NULL,
                     ReleaseDate VARCHAR(12) NOT NULL,
                     Desc VARCHAR(300) NOT NULL,
                     Type VARCHAR(10) NOT NULL,
                     Link VARCHAR(200) NOT NULL)''')
        
    def add(self, userID, userName, releaseTitle, releaseDate, desc, type, link):
        self.conn = sqlite3.connect("chh.db")
        query = f"INSERT INTO vareleases (UserID, UserName, ReleaseTitle, ReleaseDate, Desc, Type, Link) VALUES ({userID},\"{userName}\",\"{releaseTitle}\",\"{releaseDate}\",\"{desc}\",\"{type}\", \"{link}\")"
        cursor = self.conn.execute(query)
        self.conn.commit()
        return cursor.lastrowid
    
    def get_user_by_id(self, ID):
        data = self.execute(f"SELECT UserID FROM vareleases WHERE ID={ID}")
        return(data)
    
    def get_by_id(self, ID):
        data = self.execute(f"SELECT * FROM vareleases WHERE ID={ID}")
        return data
    
    def get_by_user(self, userID):
        data = self.execute(f"SELECT * FROM vareleases WHERE UserID={userID}")
        return data
    
    def get_by_date(self, date):
        data  = self.execute(f"SELECT * FROM vareleases WHERE ReleaseDate='{date}'")
        return data
    
    def check(self, ID):
        data = self.execute(f"SELECT UserID FROM vareleases WHERE ID={ID}")
        if len(data) == 0:
            return 0
        else:
            return data[0][0]
    
    def delete(self, ID):
        self.execute(f"DELETE FROM vareleases WHERE ID={ID}")
    
    def update(self, ID, releaseTitle="", releaseDate="", desc="", type="", link=""):
        if not releaseTitle == "":
            self.execute(f"UPDATE vareleases SET ReleaseTitle='{releaseTitle}' WHERE ID={ID}")
        if not releaseDate == "":
            self.execute(f"UPDATE vareleases SET ReleaseDate='{releaseDate}' WHERE ID={ID}")
        if not desc == "":
            self.execute(f"UPDATE vareleases SET Desc='{desc}' WHERE ID={ID}")
        if not type == "":
            self.execute(f"UPDATE vareleases SET Type='{type}' WHERE ID={ID}")
        if not link == "":
            self.execute(f"UPDATE vareleases SET Link='{link}' WHERE ID={ID}")