#!/usr/bin/env python3

"""
The default configuration file of the project.
It takes the DB and other important paramenters
"""

__version__ = '0.0.1'
__author__ = 'hharutyunyan'
__copyright__ = 'Copyright 2018, hharutyunyan'
__license__ = 'All Rights Reserved'
__maintainer__ = 'hharutyunyan'
__status__ = "Production"

import os

DEBUG = False

APP_HOST = '0.0.0.0'
APP_PORT = '5001'

DB_HOST = 'localhost'
DB_PORT = '5432'
DB_NAME = 'YerevanStories'
DB_USER = ''
DB_PWD = ''

SALT = ''
SECRET_KEY = ''

GMS_API_KEY = ''
