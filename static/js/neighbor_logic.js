// Paths to the geoJSON files
let minNbrhoods = "../static/data/Minneapolis_Neighborhoods.geojson";
// Path to data
let forceData = '/api/geojson';

d3.json(minNbrhoods, function (data) {
    createFeatures(data.features)
});

// Creates colors for the map based on the neighborhood id
function getColor(id) {
    return id > 80 ? '#800026' :
           id > 70 ? '#BD0026' :
           id > 60 ? '#E31A1C' :
           id > 50 ? '#FC4E2A' :
           id > 40 ? '#FD8D3C' :
           id > 30 ? '#FEB24C' :
           id > 20 ? '#FED976' :
           id > 10 ? '#FFEDA0' :
                     '#99d8c9';
}

// Sets the style
function style(feature) {
    return {
        fillColor: getColor(feature.properties.FID),
        weight: 2,
        opacity: 1,
        color: 'black',
        fillOpacity: 0.5
    };
}

function createFeatures(neighborhoods) {
    console.log(neighborhoods);
  // Create a GeoJSON layer for the neighborhood boundaries
    let minNeighborhoods = L.geoJSON(neighborhoods, {
    onEachFeature: function (feature, layer) {
        layer.bindPopup(`<h3> ${feature.properties.BDNAME} </h3>`)
    },
    pointToLayer: function (feature) {
        return L.polyline (feature.geometry.coordinates)
    },
    style: style
    });

    createMap(minNeighborhoods);
};

// Build the map
function createMap(neighborhoods) {
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
      Neighborhoods: neighborhoods
    };
  
    // Creating map object
    let myMap = L.map("map", {
      center: [44.96, -93.28],
      zoom: 11.45,
      layers: [streetmap, neighborhoods]
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
			Default at the Neighborhood (You have to select a Neighborhood to populate data (defaults to blank))
			Metric: 
				Police Incidents
				Dynamic parameter metric to swap to view Use of Force
			Attributes:
				Size: # of Incidents
				Color: Severity
            Filter: Crime Type, Income, Time, Race, Neighborhood, Precinct, Community, Year

    - Select neighborhood from dropdown menu
    - Populate the neighborhood with color coded markers based on severity of use of force
*/