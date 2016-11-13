from twilio import TwilioRestException
from twilio.rest import TwilioRestClient

account_sid = "AC5915e7510303f274520050035e5994a2" # Your Account SID from www.twilio.com/console
auth_token  = "a2a69b0c42ab9a15e486bc66013d184d"  # Your Auth Token from www.twilio.com/console

client = TwilioRestClient(account_sid, auth_token)

try:
  message = client.messages.create(body="Hello from Python",
      from_="+13128749015",    # Replace with your phone number
      to="+14243325242") # Replace with your Twilio number
except Exception as e:
  print(e)
