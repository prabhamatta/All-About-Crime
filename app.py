__author__ = 'Prabhavathi Matta'

import string
import os
import json
from os import path
import csv
import simplejson as sjson

from flask import Flask, Response, request, render_template, url_for, redirect

app = Flask(__name__)
app.debug = True

foldername = 'sfpd_incident_all_csv'
prefix = "sfpd_incident_"
extension = ".csv"

crimeLookupMap = {
    "ALL": "ALL",
    "ARSON": "ARSON",
    "ASSAULT": "ASSAULT",
    "BADCHECKS": "BAD CHECKS",
    "BRIBERY": "BRIBERY",
    "BURGLARY": "BURGLARY",
    "DISORDERLYCONDUCT": "DISORDERLY CONDUCT",
    "DUI": "DRIVING UNDER THE INFLUENCE",
    "DRUGS": "DRUG/NARCOTIC",
    "DRUNKENNESS": "DRUNKENNESS",
    "EMBEZZLEMENT": "EMBEZZLEMENT",
    "EXTORTION": "EXTORTION",
    "FAMILYOFFENSES": "FAMILY OFFENSES",
    "FORGERY": "FORGERY/COUNTERFEITING",
    "FRAUD": "FRAUD",
    "GAMBLING": "GAMBLING",
    "KIDNAPPING": "KIDNAPPING",
    "LARCENY": "LARCENY/THEFT",
    "LIQUORLAWS": "LIQUOR LAWS",
    "LOITERING": "LOITERING",
    "MISSINGPERSON": "MISSING PERSON",
    # "NONCRIMINAL": "NON-CRIMINAL",
    "OTHEROFFENSES": "OTHER OFFENSES",
    "PORNOGRAPHY": "PORNOGRAPHY/OBSCENE MAT",
    "PROSTITUTION": "PROSTITUTION",
    # "RECOVEREDVEHICLE": "RECOVERED VEHICLE",
    "ROBBERY": "ROBBERY",
    "RUNAWAY": "RUNAWAY",
    "SEXFORCIBLE": "SEX OFFENSES, FORCIBLE",
    "SEXNONFORCIBLE": "SEX OFFENSES, NON FORCIBLE",
    "STOLENPROPERTY": "STOLEN PROPERTY",
    "SUICIDE": "SUICIDE",
    "SUSPICIOUSOCC": "SUSPICIOUS OCC",
    "TRESPASS": "TRESPASS",
    "VANDALISM": "VANDALISM",
    "VEHICLETHEFT": "VEHICLE THEFT",
    "WARRANTS": "WARRANTS",
    "WEAPONLAWS": "WEAPON LAWS"
}


@app.route('/', methods=["GET","POST"])
def index():
    """Builds a template based on a GET request, with some default
    arguements"""
    index_title = request.args.get("title", "All About crime")
    hello_name = request.args.get("name", "Prabhavathi Matta")

    return render_template(
                'gmaps2.html',
                title=index_title,
                name=hello_name )


@app.route('/api/getcrimes',methods=["GET","POST"])
def apiserver():
    year = request.args.get("year", "2003")
    month = int(request.args.get("month", 1))
    crime = request.args.get("crime", "ALL").upper()
    timeofday = request.args.get("timeofday", "BOTH").upper()

    crime = crime.split(",")
    crime = [crimeLookupMap[cr] for cr in crime if (cr in crimeLookupMap)]

    print "Got Request :"
    print "%s %s %s %s"%(year, month, crime, timeofday)

    # get file for year and month
    # filter crimes, based on filter (name , time)
    filename = "%s/%s_%s_%s%s"%(foldername, prefix, year, "%02d"%month, extension)
    data = sjson.loads(open(filename, 'r').read())
    outdata = []

    for info in data:
        finf = map(lambda x: info[x], [0, 4, 5])

        if 'ALL' not in crime:
            if info[0] not in crime:
                continue
        if timeofday == 'DAY':
            if (int(info[3][:2]) < 6) or (int(info[3][:2]) > 18):
                continue
        if timeofday == 'NIGHT':
            if (6 < int(info[3][:2]) < 18):
                continue
        if info[4] == "0":
            continue
        if info[0] == 'NON-CRIMINAL':
            continue

        outdata.append(finf)

    outdata = sjson.dumps(outdata)
    print "returning %d bytes of data"%(len(outdata))
    return outdata


@app.route('/api/getnbstats', methods=["GET", "POST"])
def getnbstats():
    year = request.args.get("year", "2003")
    month = int(request.args.get("month", 1))
    nb = request.args.get("nb", "").upper()
    timeofday = request.args.get("timeofday", "BOTH").upper()

    print "Got Request :"
    print "getnbstats : %s %s %s %s"%(year, month, nb, timeofday)

    # get file for year and month
    # filter crimes, based on filter (name , time)
    filename = "%s/%s_%s_%s%s"%(foldername, prefix, year, "%02d"%month, "_nb_cr.json")
    data = sjson.loads(open(filename, 'r').read())
    print data.keys()
    outdata = data.get(nb, {})

    if timeofday == 'DAY':
        outdata = dict((k, v[0]) for k, v in outdata.items())
    if timeofday == 'NIGHT':
        outdata = dict((k, v[1]) for k, v in outdata.items())
    if timeofday == 'BOTH':
        outdata = dict((k, (v[0] + v[1])) for k, v in outdata.items())

    outdata = sjson.dumps(outdata)
    print "returning %d bytes of data"%(len(outdata))
    return outdata

@app.route('/getCrimeLookupMap',methods=["GET","POST"])
def getCrimeLookupMap():
    oppmap = [(v,k) for k, v in sorted(crimeLookupMap.items())]
    return sjson.dumps(oppmap)

@app.route('/gmaps2.html', methods=["GET","POST"])
def gmapsfile():
    print "arived here"
    return app.send_static_file('gmaps2.html')

@app.route('/sf_neighs3.kml', methods=["GET","POST"])
def sfneighs():
    return app.send_static_file('sf_neighs3.kml')


@app.route('/static/<path:filename>', methods=["GET","POST"])
def send_foo(filename):
    return app.send_static_file(os.path.join(os.path.join(os.path.dirname(__file__), 'static'), filename))


# def analyze_3_month_data():
#     categ_data= {}
#     fw = open("categ_data.json", "w")
    
#     with open("SFPD_Incidents_Previous_Three_Months.csv", "r") as csvfile:
#         a = csvfile.readline()
#         lines = csv.reader(csvfile, quotechar='"')
        
#         for line in lines:
#             categ = line[1]
#             loc = (line[10],line[9])
#             if categ not in categ_data:
#                 categ_data[categ] = [loc]
#             else:
#                 categ_data[categ].append(loc)
#     fw.write(json.dumps(categ_data))
                
if __name__ == '__main__':
    #app.run(port=int(environ['FLASK_PORT']))
    # app.run(host="127.0.0.1",port=7777)
    app.run(port=7777)
    
    #analyze_3_month_data()