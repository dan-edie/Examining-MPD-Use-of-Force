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

from urllib.parse import urlparse

print(os.environ.get("DATABASE_URL"))


os.environ["DATABASE_URL"] = "postgres://uphrhjjikbnoqu:4a3e5c8de842450307f62b684c62f93dee4a5a0146c62eac579ff887884a979c@ec2-54-159-138-67.compute-1.amazonaws.com:5432/d3vhg0ri9rvco2"

if "DATABASE_URL" in os.environ :
    url = urlparse(os.environ.get('DATABASE_URL'))
    db = "dbname=%s user=%s password=%s host=%s " % (url.path[1:], url.username, url.password, url.hostname)
    schema = "schema.sql"
    conn = psycopg2.connect(db)
    #cur = conn.cursor()
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

@app.route("/map")
def map_view():

    return render_template("map.html")

@app.route("/neighborhoods")
def neighborhood_view():

    return render_template("neighborhood.html")

@app.route("/api/geojson")
def welcome():
    cur.execute("select * from vw_police_use_of_force") 
    columns = [col[0] for col in cur.description]
    use_of_force = [dict(zip(columns, row)) for row in cur.fetchall()]
    return jsonify(use_of_force)

if __name__ == "__main__":
    app.run(debug=True)