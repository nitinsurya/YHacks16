#!flask/bin/python


from flask import Flask, request, send_from_directory, jsonify, make_response, abort
import os
import requests
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
  req = requests.get(url)
  if req.status_code == 200:
    
  else:
    return make_response(jsonify({"error": "Something went wrong"}))

  url = "http://api.reimaginebanking.com/accounts/" + account_id + "/bills?key=" + mhack_key
  req = requests.get(url).json()
  return make_response(jsonify(out_vals))

@app.errorhandler(404)
def not_found(error):
  return make_response(jsonify({'error': 'Not found'}), 404)

if __name__ == '__main__':
  app.run(host='0.0.0.0', port=8081, debug=True, threaded=True)
