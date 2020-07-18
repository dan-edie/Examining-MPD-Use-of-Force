from flask import Flask, jsonify, render_template
import sqlalchemy
import psycopg2
from sqlalchemy import create_engine
import json
#from flask_sqlalchemy import SQLAlchemy
import os
#################################################
# Flask Setup
#################################################
app = Flask(__name__)

print(os.environ.get("DATABASE_URL"))

if "DATABASE_URL" in os.environ :
    import urlparse # for python 3+ use: from urllib.parse import urlparse
    result = urlparse.urlparse(os.environ.get("DATABASE_URL"))
    # also in python 3+ use: urlparse("YourUrl") not urlparse.urlparse("YourUrl") 
    username = result.username
    password = result.password
    database = result.path[1:]
    hostname = result.hostname
    conn = psycopg2.connect(
    database = database,
    user = username,
    password = password,
    host = hostname )
else: 
    conn = psycopg2.connect(host="localhost", port = 5432, database="Minneapolis_Police_Force_db")

print(conn)

#app.config['SQLALCHEMY_DATABASE_URI'] = os.environ.get("DATABASE_URL") or 'postgres://swain:db@localhost/Minneapolis_Police_Force_db'
#print(app.config['SQLALCHEMY_DATABASE_URI'])

#engine = create_engine(f'postgresql://swain:db@localhost:5432/Minneapolis_Police_Force_db')
#connection = engine.connect()
# Create a cursor object


cur = conn.cursor()
# engine = psycopg2.connect("postgresql://postgres:postgres@localhost:52632/mydatabase", echo=False)
#################################################
# Flask Routes
#################################################
#pd.read_sql

@app.route("/")
def echo():
    
    return render_template("index.html")


@app.route("/api/geojson")
def welcome():
    cur.execute("select * from vw_police_use_of_force") 
    columns = [col[0] for col in cur.description]
    use_of_force = [dict(zip(columns, row)) for row in cur.fetchall()]
    return jsonify(use_of_force)

if __name__ == "__main__":
    app.run(debug=True)