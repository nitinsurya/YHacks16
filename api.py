#!flask/bin/python

from flask import Flask, request, send_from_directory, jsonify, make_response, abort
import os
import requests
import json
from flask_cors import CORS, cross_origin
from collections import Counter
import datetime

app = Flask(__name__, static_url_path='')
CORS(app)

@app.route('/')
def root():
    return app.send_static_file('index.html')

@app.route('/js/<path:filename>')
def serve_static(filename):
    root_dir = os.path.dirname(os.path.realpath(__file__))
    return send_from_directory(os.path.join(root_dir, 'static', 'js'), filename)

@app.route('/app_content', methods=['GET'])
def app_content():
  coords = request.args.get('coords')
  #req = requests.get(url)
  if True or req.status_code == 200:
    out_vals = prepare_data()
  else:
    return make_response(jsonify({"error": "Something went wrong"}))

  #url = "http://api.reimaginebanking.com/accounts/" + account_id + "/bills?key=" + mhack_key
  #req = requests.get(url).json()
  return make_response(jsonify(out_vals))

@app.route('/activities', methods=['GET'])
def activities():
  with open('activities_bkp.json') as data_file:
    json_data = json.load(data_file)
    return make_response(jsonify(json_data))

@app.errorhandler(404)
def not_found(error):
  return make_response(jsonify({'error': 'Not found'}), 404)


def prepare_data():
  with open('consolidated_50000.json') as data_file:
    zip_data = json.load(data_file)
    return list(zip_data.values())

if __name__ == '__main__':
  app.run(host='0.0.0.0', port=80, debug=True, threaded=True)
