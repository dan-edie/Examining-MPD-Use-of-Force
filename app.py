from flask import Flask, jsonify, render_template, request, redirect, json
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

#Fetch all neighborhood names 
cur.execute("SELECT name FROM neighborhood where neighborhood_id in (select distinct neighborhood_id from vw_police_use_of_force) and neighborhood_id in (select distinct neighborhood_id from race_by_neighborhood) and neighborhood_id in (select distinct neighborhood_id from household_income_by_neighborhood) ORDER BY name;")

#Convert list of neighborhood names to a dixtionary
columns = [col[0] for col in cur.description]
neighborhood = [dict(zip(columns, row)) for row in cur.fetchall()]

@app.route("/", methods=['GET', 'POST'])
def echo():
    
    #reroute to new neighborhood url based on form input from user
    if request.method == 'POST':
        newNeighborhood = request.form['neighborhood']
        return redirect("/" + newNeighborhood)

    return render_template("index.html", neighborhood=neighborhood)

@app.route("/map")
def map_view():

    return render_template("map.html")

@app.route("/neighborhoods")
def neighborhood_view():

    return render_template("neighbor_incidents.html")

@app.route("/api/geojson")
def welcome():
    cur.execute("select * from vw_police_use_of_force") 
    columns = [col[0] for col in cur.description]
    use_of_force = [dict(zip(columns, row)) for row in cur.fetchall()]
    return jsonify(use_of_force) 

    

@app.route("/api/nbh_bubble")
def nbh_bubble():
    cur.execute("select * from force_nbh_stats") 
    columns = [col[0] for col in cur.description]
    nbh_stats = [dict(zip(columns, row)) for row in cur.fetchall()]
    return jsonify(nbh_stats) 

@app.route("/geojson")
def mpls_geojson():
    
    return render_template("map.html")

@app.route("/mpls_deepdive", methods=['GET', 'POST'])
def mpls_deepdive():

    #reroute to new neighborhood url based on form input from user
    if request.method == 'POST':
        newNeighborhood = request.form['neighborhood']
        return redirect("/" + newNeighborhood)
    
    return render_template("mpls_deepdive.html", neighborhood=neighborhood)

@app.route("/inference")
def inference():
    
    return render_template("Inference.html")

# Add a new route to display stats for dynamically seleted neighborhood
@app.route("/<neighborhood>")
def neighborhood_data(neighborhood):

    #Column names for table in neighborhood page
    #columns_data = ['Year', 'Police Incidents Count', 'Use of Force Cases', '% White Use of Force', '% Of Color Use of Force', '% White (Demographics)'
               # ,'% Of Color (Demographics)', 'Median Household Income','Income Group']

    #Query table in neighborhood page
    cur.execute("select * from police_use_of_force WHERE neighborhood =  %s;", ((neighborhood),))
    columns = [col[0] for col in cur.description]
    nhbd_dict = [dict(zip(columns, row)) for row in cur.fetchall()]
    neighborhood_use_of_force = json.dumps(nhbd_dict,default=str)
    
    #income data
    cur.execute("select * from vw_neighborhood_income WHERE name =  %s;", ((neighborhood),))
    columns_n = [col[0] for col in cur.description]
    income_dict = [dict(zip(columns_n, row)) for row in cur.fetchall()]
    income = json.dumps(income_dict,default=str)

    #demographics
    cur.execute("select * from vw_neighborhood_demographics WHERE name =  %s;", ((neighborhood),))
    columns_m = [col[0] for col in cur.description]
    demographics_dict = [dict(zip(columns_m, row)) for row in cur.fetchall()]
    demographics = json.dumps(demographics_dict,default=str)
   
 
    return render_template("neighborhood.html", neighborhood_use_of_force=neighborhood_use_of_force,  nbr=neighborhood, income=income, demographics=demographics ) 


if __name__ == "__main__":
    app.run(debug=True)