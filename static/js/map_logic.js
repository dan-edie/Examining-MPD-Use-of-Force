// Paths to the geoJSON files
let minNbrhoods = "../static/data/Minneapolis_Neighborhoods.geojson";
let minPolPrec = "../static/data/Minneapolis_Police_Precincts.geojson";
let minCommunities = "../static/data/Communities.geojson";
// Path to data
let forceData = '/api/geojson';

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
      color: "black",
      fillColor: "indigo",
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
      fillColor: "orange",
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
      fillColor: "grey",
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
    layers: [streetmap, neighborhoods]
  });

  // Create the markers for Police incidents
  d3.json(forceData, function (forcedata) {
    // Create a markers cluster group
    let markers = L.markerClusterGroup();
//severity_of_resistance
    forcedata.forEach(function (incident) {
      markers.addLayer(L.marker([parseFloat(incident.lat), parseFloat(incident.long)])
        .bindPopup(`<h3> Date of Incident: ${incident.response_date} </h3>
        <h3> Use of Force Type: ${incident.police_use_of_force_type} </h3>
        <hr> <h3> Subject Race: ${incident.subject_race} </h3>`));
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
  
