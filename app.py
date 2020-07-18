from flask import Flask, jsonify, render_template
import sqlalchemy
import psycopg2
from sqlalchemy import create_engine
#from flask_sqlalchemy import SQLAlchemy
import os
#################################################
# Flask Setup
#################################################
app = Flask(__name__)

#engine = create_engine(f'postgresql://swain:db@localhost:5432/Minneapolis_Police_Force_db')
#connection = engine.connect()
# Create a cursor object
conn = psycopg2.connect(host="localhost", port = 5432, database="Minneapolis_Police_Force_db")


cur = conn.cursor()
# engine = psycopg2.connect("postgresql://postgres:postgres@localhost:52632/mydatabase", echo=False)
#################################################
# Flask Routes
#################################################
#pd.read_sql


@app.route("/")
def welcome():
    cur.execute("select * from vw_police_use_of_force;")
    nhbd = cur.fetchall()
    return jsonify(nhbd)
    #return "Hello World"
if __name__ == "__main__":
    app.run(debug=True)