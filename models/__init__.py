import sqlite3
from utilities.logging import logger

class Database:
    def __init__(self):
        self.conn = None

    def execute(self, query):
        try:
            self.conn = sqlite3.connect("chh.db")
            cursor = self.conn.execute(query)
            self.conn.commit()
            data = cursor.fetchall()
            self.conn.close()
            return data
        except sqlite3.Error as e:
            logger.error(f"Database error: {e}")
            raise

    def check_len(self, data):
        if len(data) == 0:
            return False
        else:
            return True

    def close(self):
        self.connection.close()