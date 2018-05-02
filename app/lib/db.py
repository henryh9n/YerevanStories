"""
The lib for connecting to the main db.
Uses config.py for db connection properties
"""

__version__ = '0.0.1'
__author__ = 'hharutyunyan'
__copyright__ = 'Copyright 2018, hharutyunyan'
__license__ = 'All Rights Reserved'
__maintainer__ = 'hharutyunyan'
__status__ = "Production"

import psycopg2
from app import *


class db(object):
    """Class to connect to DB and execute queries."""

    __insert = "INSERT INTO %s(%s) VALUES (%s)"
    __update = "UPDATE %s SET %s WHERE %s"
    __select = "SELECT %s FROM %s WHERE %s"

    def __init__(self):
        """Init the class."""
        self.host = app.config["DB_HOST"]
        self.user = app.config["DB_USER"]
        self.pwd = app.config["DB_PWD"]
        self.db = app.config["DB_NAME"]
        self.conn = psycopg2.connect(
            "dbname='{}' user='{}' host='{}' password='{}'".format(
                self.db, self.user, self.host, self.pwd
            )
        )

    def execute(self, query, args={}):
        """Execute a query."""
        self.cur = self.conn.cursor()

        try:
            self.cur.execute(query, args)
            self.conn.commit()
        except Exception as e:
            self.conn.rollback()
            raise Exception(e)
        return self.cur

    def rollback(self):
        """Rolback the DB."""
        self.conn.rollback()

    def close(self):
        """Close the DB connection."""
        if self.cur:
            self.cur.close()
            self.cur = None
        if self.conn:
            self.conn.close()
            self.conn = None

    def select(self, table, fields, conditions=True, limit=0, page=0,
               order_by='', count=False):
        """Perform a select query."""
        query = self.__select % (fields, table, conditions)
        if order_by:
            query += " ORDER BY %s" % order_by
        if limit:
            query += " LIMIT %s" % str(limit)
            query += " OFFSET %s" % str((page - 1) * limit)
        query = self.execute(query)

        res = []
        values = query.fetchall()
        for value in values:
            cur = {}
            for i in range(0, len(value)):
                cur[query.description[i][0]] = value[i]
            res.append(cur)

        if count:
            amount = self.__select % ('COUNT(*) as count', table, conditions)
            amount = self.execute(amount)
            amount = amount.fetchone()
            res = {'count': amount[0], 'items': res}

        return res

    def insert(self, table, values, returning=''):
        """Perform an insert query."""
        query = self.__insert % (
            table, ", ".join(str(v) for v in values.keys()),
            ", ".join(str("'" + v + "'") for v in values.values())
        )
        if returning:
            query += " RETURNING %s" % returning
        res = self.execute(query)
        return res.fetchone() if returning else res

    def update(self, table, values, condition):
        """Perform an update query."""
        struct = "%s=%s"
        fields = []
        for key, value in values.items():
            if type(value) is str:
                fields.append(struct % (key, "'%s'" % value))
        if type(condition) is list:
            condition = ", ".join(condition)
        query = self.__update % (
            table, ", ".join(fields), condition)

        return self.execute(query)
