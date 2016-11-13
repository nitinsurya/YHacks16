#!flask/bin/python

from flask import Flask, request, redirect
import twilio.twiml
from urllib.request import Request, urlopen
import urllib
import json

#ID access to API
TOKEN = "63bab4050efb9bcdf6c436c00e2bc47d" # e.g.: "f03c3c76cc853ee690b879909c9c6f2a"
url = "https://cloudpanel-api.1and1.com/v1"

app = Flask(__name__)

# Try adding your own number to this list!
callers = {
    "+13128749015": "Nitin Surya"
}

def _deleteServer(id):
    #Configure the request
    _command = url + "/servers/" + id
    _method = 'DELETE'
    request = Request(_command,
                      headers={'X-TOKEN':TOKEN, 'content-type':'application/json'},
                      method=_method)

    #Try to get the response
    try:
        response = urlopen(request)
        content = response.read()
        return (content.decode())
    #Fetch error
    except urllib.error.URLError as e:
        return("Error " + str(e.code) + ":" + e.reason)

def _cloneServer(id, content):
	#Configure the request
		_command = url + "/servers/" + id + "/clone"
		_method = 'POST'
		request = Request(_command, data=content.encode(encoding='utf_8'),
				headers={'X-TOKEN':TOKEN, 'content-type':'application/json'},
				method=_method)

		#Try to get the response
		try:
			response = urlopen(request)
			content = response.read()
			return (content.decode())
		#Fetch error
		except urllib.error.URLError as e:
			return("Error " + str(e.code) + ":" + e.reason)

@app.route("/", methods=['GET', 'POST'])
def hello_monkey():
    """Respond and greet the caller by name."""

    server_id = "CD4C9C9DD8E45609A8F9A1DB2148F486" # e.g.: "5340033E7FBBC308BC329414A0DF3C20"
    server_name = 'yhacks clone'

    from_number = request.values.get('From', None)
    print(request.values)
    if from_number in callers:
      if request.values.get('Body').lower() == 'add':
        message = callers[from_number] + ", adding server!"
        _cloneServer(server_id, json.dumps({'name': server_name}))
      elif request.values.get('Body').lower() == 'remove':
        message = callers[from_number] + ", removing server!"
        #_deleteServer('')
    else:
        message = "Monkey, thanks for the message!"
    print(message)

    resp = twilio.twiml.Response()
    resp.message(message)

    return str(resp)

if __name__ == "__main__":
  app.run(host='0.0.0.0', port=8081, debug=True, threaded=True)
