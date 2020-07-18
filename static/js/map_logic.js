// Paths to the geoJSON files
let minNbrhoods = "../static/js/Minneapolis_Neighborhoods.geojson";
let minPolPrec = "../static/js/Minneapolis_Police_Precincts.geojson";
let minCommunities = "../static/js/Communities.geojson";
// let forceData = "../static/js/forceData.json";
let forceData = '/api/geojson'; //ignore the name before the blah.com/api/geojson

// Perform a GET on the Minneapolis Neighborhoods Data
d3.json(minNbrhoods, function (data) {
  // Perform a GET on the Minneapolis Police Precint Data
  d3.json(minPolPrec, function (preData) {
  // Perform a GET on Minneapolis Community Data
    d3.json(minCommunities, function (comData) {
      // Send the data to the createFeatures function to begin building the map
      createFeatures(data.features, preData.features, comData.features);
    });
  });
});

// Building the layers of the map
function createFeatures(neighborhoods, policePrecints, communities) {

  // Create a GeoJSON layer for the neighborhood boundaries
  let minNeighborhoods = L.geoJSON(neighborhoods, {
    onEachFeature: function (feature, layer) {
      layer.bindPopup(`<h3> ${feature.properties.BDNAME} </h3>`)
    },
    pointToLayer: function (feature) {
        return L.polyline (feature.geometry.coordinates)
    },
    style: {
      color: "blue",
      weight: 2,
      opacity: 1,
      fillOpacity: 0.5
    }
  });

  let minPolicePrecincts = L.geoJSON(policePrecints, {
    onEachFeature: function (feature, layer) {
      layer.bindPopup(`<h3> ${feature.properties.PRECINCT} </h3>`)
    },
    pointToLayer: function (feature) {
      return L.polyline(feature.geometry.coordinates)
    },
    style: {
      color: 'red',
      weight: 2,
      opacity: 0.5,
      fillOpacity: 0.3
    }
  });

  let communityLayer = L.geoJSON(communities, {
    onEachFeature: function (feature, layer) {
      layer.bindPopup(`<h3> ${feature.properties.CommName} </h3>`)
    },
    pointToLayer: function (feature) {
      return L.polyline(feature.geometry.coordinates)
    },
    style: {
      color: "green",
      weight: 2,
      opacity: 1,
      fillOpacity: 0.5
    }
  });

  createMap(minNeighborhoods, minPolicePrecincts, communityLayer);

};

// Build the map
function createMap(neighborhoods, policePrecints, communities) {

  // Adding tile layer
  let streetmap = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
    tileSize: 512,
    maxZoom: 18,
    zoomOffset: -1,
    id: "mapbox/streets-v11",
    accessToken: API_KEY
    });

  // Define a baseMaps object to hold base layers
  let baseMaps = {
    "Street Map": streetmap,
  };

  // Create overlay object to hold our overlay layer
  let overlayMaps = {
    Neighborhoods: neighborhoods,
    "Police Precints": policePrecints,
    Communities: communities
  };

  // Creating map object
  let myMap = L.map("map", {
    center: [44.96, -93.28],
    zoom: 11.45,
    layers: [streetmap, communities]
  });

  // Create the markers for Police incidents
  d3.json(forceData, function (forcedata) {
    console.log(forcedata);
    // Create a markers cluster group
    let markers = L.markerClusterGroup();

    forcedata.forEach(function (incident) {
      markers.addLayer(L.marker([incident.lat, incident.long])
        .bindPopup(incident.police_use_of_force_type));
    })
  // Add our marker cluster layer to the map
  myMap.addLayer(markers);
  });

  // Create layer control
  // Pass in our baseMaps and overlayMaps
  // Add the layer control to the map
  L.control.layers(baseMaps, overlayMaps, {
    collapsed: false
}).addTo(myMap);
};

/*
	1.) Geo Map: 
			Default at the overall Minneapolis
				Filterable w/a click Minneapolis -> Community -> Neighborhood
			Metric: 
				Police Incidents
				Dynamic parameter metric to swap to view Use of Force
			Attributes:
				Size: # of Incidents
				Color: Severity
			Filter: Crime Type, Income, Time, Race, Neighborhood, Precinct, Community, Year
      *Add time warp view

  	1.) Geo Map: 
			Default at the Neighborhood (You have to select a Neighborhood to populate data (defaults to blank))
			Metric: 
				Police Incidents
				Dynamic parameter metric to swap to view Use of Force
			Attributes:
				Size: # of Incidents
				Color: Severity
			Filter: Crime Type, Income, Time, Race, Neighborhood, Precinct, Community, Year
*/
  
