#!/usr/bin/env python3

"""Initializing the application."""

__version__ = '0.0.1'
__author__ = 'hharutyunyan'
__copyright__ = 'Copyright 2017, hharutyunyan'
__license__ = 'All Rights Reserved'
__maintainer__ = 'hharutyunyan'
__status__ = "Production"


from flask import Flask, render_template, request
import json


app = Flask(__name__, template_folder='templates', static_folder='static')
app.config.from_object('config')

from app.lib.helpers import getStories, addStory


@app.route('/', methods=['GET'])
def home():
    """Render home page."""
    return render_template('index.html')


@app.route('/getStories/<place_id>', methods=['POST'])
def stories(place_id):
    """Return list of stories given place id."""
    return json.dumps(getStories(place_id))


@app.route('/addStory', methods=['POST'])
def add_story():
    """Add a story."""
    data = request.form.to_dict()
    data['date'] = 'now'
    return addStory(data)
