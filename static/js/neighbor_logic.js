// Paths to the geoJSON files
let minNbrhoods = "../static/data/Minneapolis_Neighborhoods.geojson";
// Path to data
let forceData = '/api/geojson';

function getMetaData() {
    // import data using d3
    d3.json(forceData).then((importedData) => {
        console.log(importedData);

        // populates the drop down menu with the subject IDs
        // d3.select("#selDataset").selectAll("option")
        //     .data(importedData.names)
        //     .enter()
        //     .append("option")
        //     .html(function(names) {
        //         return `<option> ${names} </option>`
        //     });

        // firstID = importedData.names[0];

        // buildTable(firstID);
        // buildCharts(firstID);
    });
};

// function optionChanged(sampleID) {
//     buildTable(sampleID);
//     buildCharts(sampleID);
// };

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