from flask import Flask, render_template, request, redirect, url_for, session
import json
from flaskext.mysql import MySQL

app = Flask(__name__)


#DB
app.config['MYSQL_DATABASE_USER'] = 'wsc_admin'
app.config['MYSQL_DATABASE_PASSWORD'] = 'Adminpass00##'
app.config['MYSQL_DATABASE_DB'] = 'beermap'
app.config['MYSQL_DATABASE_HOST'] = '62.210.119.250'

mysql = MySQL()
mysql.init_app(app)

def queryDB(sql):
    conn = mysql.connect()
    cursor = conn.cursor()
    conn.ping()
    cursor.execute(sql)
    data = cursor.fetchall()
    conn.close()
    return data

def insert(sql):
    conn = mysql.connect()
    cursor = conn.cursor()
    conn.ping()
    cursor.execute(sql)
    conn.commit()
    conn.close()




#ROUTINGS
@app.route("/")
def index():
    data = queryDB("SELECT * FROM bars")
    print(data)
    return render_template("map.html")




#API
@app.route("/query", methods=['POST'])
def query():
    data = queryDB("SELECT * FROM bars")
    return json.dumps(data)
    
@app.route("/add", methods=['POST'])
def add():
    data = request.form.to_dict(flat=False)
    print(data)
    insert("INSERT INTO bars (name, description, lat, lon) VALUES ('{}', '{}', '{}', '{}')".format(data['name'][0], data['description'][0], data['lat'][0], data['lng'][0]))
    id = queryDB("SELECT id FROM bars WHERE name='{}'".format(data['name'][0]))
    return json.dumps(id)