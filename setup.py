#!/usr/bin/python3

import threading
import requests
import random
import pymysql.cursors
import MySQLdb
import json
from datetime import datetime

data_to_load = 0

if data_to_load == 0:
  with open('zip_coords.json') as data_file:
    zip_data = json.load(data_file)

  def get_empty_data(d):
    return {
        "dental": False,
        "accident": True,
        "promo": d['promo_codes'] if 'promo_codes' in d else None,
        "policy_dental": None,
        "policy_accident": d['policy_start_date']
        }

  count = '50000'
  url = 'https://v3v10.vitechinc.com/solr/policy_info/select?indent=on&q=insurance_product=Accident&wt=json&rows='
  r = requests.get(url + count).json()
  outfile = open('policy_info_accident.json', 'w')
  d1 = {}
  for val in r['response']['docs']:
    d1[val['participant_id']] = get_empty_data(val)
  print("1")

  json.dump(r['response']['docs'], outfile)
  outfile.close()

  def get_age(dob):
    return datetime.now().year - datetime.strptime(dob, "%Y-%m-%dT%H:%M:%SZ").year

  def add_user_data(d, orig, zip_data):
    if len(d['zip']) < 5:
      d['zip'] = '0'*(5 - len(d['zip'])) + d['zip']

    if d['zip'] in zip_data:
      zip_val = zip_data[d['zip']]
    else:
      zip_val = zip_data[str(60607 + int(random.random() * 0.4 * 10))]

    temp = {
        "zip": d['zip'],
        "lat": zip_val['LAT'],
        "lon": zip_val['LNG'],
        "marital_status": d['marital_status'],
        "state": d['state'],
        "date_added": d['date_added'],
        "first_name": d['first_name'],
        "age": get_age(d['dob']),
        "sex": d['gender']
        }
    return {**orig, **temp}

  url = 'https://v3v10.vitechinc.com/solr/participant/select?indent=on&q={!join%20from=participant_id%20to=id%20fromIndex=policy_info}insurance_product=Accident&wt=json&rows='
  r = requests.get(url + count).json()
  participant_id = []
  for index, elem in enumerate(r['response']['docs']):
    #d1[hack_vals[index]] = add_user_data(elem, d1[hack_vals[index]], zip_data)
    if elem['id'] in d1:
      d1[elem['id']] = add_user_data(elem, d1[elem['id']], zip_data)
    participant_id.append(elem['id'])
    print('.', end=" ")
  print("2")
  outfile = open('participant.json', 'w')
  json.dump(r['response']['docs'], outfile)
  outfile.close()

  url = 'https://v3v10.vitechinc.com/solr/policy_info/select?indent=on&wt=json&q={!join%20to=participant_id%20from=id%20fromIndex=participant}*:*&fq=insurance_product=Dental&fq=id:('
  urls = []
  extra = "&rows=" + count
  multiplier = 25
  val = []
  for i in range(0, int(len(participant_id)/multiplier) + 1):
    participant_id_link = '%20'.join(str(x) for x in participant_id[i*multiplier : (i + 1)*multiplier])
    urls.append(url + participant_id_link + ")" + extra)

  def fetch_url(url):
    global val, d1
    r = requests.get(url).json()
    if 'response' in r:
      val += r['response']['docs']
      for elem in r['response']['docs']:
        if elem['participant_id'] in d1:
          d1[elem['participant_id']]['dental'] = True
          d1[elem['participant_id']]['policy_dental'] = elem['policy_start_date']

    print('.', end=" ")

  for url in urls:
    fetch_url(url)
  #threads = [threading.Thread(target=fetch_url, args=(url,)) for url in urls]
  #for thread in threads:
  #  thread.start()
  #for thread in threads:
  #  thread.join()

  print('3')
  outfile = open('policy_info_dental.json', 'w')
  json.dump(val, outfile)
  outfile.close()

  outfile = open('consolidated_50000_1.json', 'w')
  json.dump(d1, outfile, separators=(',',':'))
  outfile.close()

else:
  url = 'https://v3v10.vitechinc.com/solr/activities/select?indent=on&q=*:*&wt=json'
  r = requests.get(url).json()
  outfile = open('activities.json', 'w')
  t = []
  for index, x in enumerate(r['response']['docs']):
    t.append({"targeted_counts": x["targeted_counts"], "activity_type": x["activity_type"], "promocodes": x["promocodes"] if "promocodes" in x else None, "date": x['activity_date']})
  json.dump(t, outfile)
  outfile.close()

