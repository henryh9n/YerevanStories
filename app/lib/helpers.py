"""
The helper methods for getting and adding stories
Is used in __init__.py for the functionality
"""

__version__ = '0.0.1'
__author__ = 'hharutyunyan'
__copyright__ = 'Copyright 2018, hharutyunyan'
__license__ = 'All Rights Reserved'
__maintainer__ = 'hharutyunyan'
__status__ = "Production"

from app.lib.db import db


def getStories(place_id):
    """Return the stories given the place id."""
    database = db()
    return database.select('stories', 'id, story, author',
                           "place_id LIKE '{}'".format(place_id))


def addStory(data):
    """Add a story for given place id."""
    database = db()
    database.insert('stories', data)
    return '{"status": "ok"}'
