// ***************************************************************** //
//                      INITIALIZE THE DASHBOARD                     //
// ***************************************************************** //
// Grab a reference to the dropdown select element
let selector = d3.select("#selDataset");

// Use the list of sample names to populate the select options
d3.json("/names").then((sampleNames) => {
  sampleNames.forEach((sample) => {
    selector
      .append('option')
      .text(`BB_${sample}`)
      .property("value", `BB_${sample}`);
  });

  // Use the first sample from the list to build the initial plots
  const firstSample = sampleNames[0];
  buildDataCharts(firstSample);
  buildMetadata(firstSample);
});

/**
 * Display the sample metadata as well as generate gauge plot for selected sample ID
 * @param {*} sample sample ID
 */
function buildMetadata(sample) {

  // Use d3 to select the panel with id of `#sample-metadata`
  d3.json(`/metadata/${sample}`).then((d) => {

  // .......... Metadata ..........//    
    // Use `.html("") to clear any existing metadata
    d3.select("#sample-metadata").html("");
    // Use `Object.entries` to add each key and value pair to the panel
    Object.entries(d).forEach(([k, v]) => {
      d3.select("#sample-metadata")
        .append('div')
        .attr('class', 'p-2')
        .text(`${k}: ${v}`);
    });

    // .......... Gauge plot .......... //
    // "Speed (level)", "Meter point (degrees)", "pointer (radius)", and "Radians" to calculate "x" and "y" for gauge plot
    let level = parseInt(d.WFREQ) * 18;
    let degrees = 180 - level;
    let radius = .5;
    let radians = degrees * Math.PI / 180;

    // Calculate "x" and "y" for "A", "B", and "C" vertices of pointer triangle in gauge plot
    // https://com2m.de/blog/technology/gauge-charts-with-plotly/
    let xA = 0.05 * Math.cos((degrees - 90) * Math.PI / 180);
    let yA = 0.05 * Math.sin((degrees - 90) * Math.PI / 180);    
    let xB = -xA;
    let yB = -yA;    
    let xC = radius * Math.cos(radians);
    let yC = radius * Math.sin(radians);

    // Path
    let path = `M ${xA} ${yA} L ${xB} ${yB} L ${xC} ${yC} Z`;

    let data = [
    {
      type: "scatter",
      x: [0],
      y: [0],
      marker: {
        size: 20,
        color: "ff3300"
      },
      showlegend: false,
      name: 'WFREQ',
      text: d.WFREQ,
      hoverinfo: 'text+name'
    },
    {
      values: [1, 1, 1, 1, 1, 1, 1, 1, 1, 9],
      rotation: 90,
      text: ['8-9', '7-8', '6-7', '5-6', '4-5', '3-4', '2-3', '1-2', '0-1', ''],
      textinfo: 'text',
      textposition: 'inside',
      marker: {colors:['rgba(14, 127, 0, .5)', 'rgba(110, 154, 22, .5)',
                         'rgba(170, 202, 42, .5)', 'rgba(202, 209, 95, .5)',
                         'rgba(210, 206, 145, .5)', 'rgba(232, 226, 202, .5)',
                         'rgba(230, 230, 230, .5)', 'rgba(235, 245, 230, .5)',
                         'rgba(255, 255, 230, .5)', 'rgba(255, 255, 255, 0)']},
      labels: ['8-9', '7-8', '6-7', '5-6', '4-5', '3-4', '2-3', '1-2', '0-1', ''],
      hoverinfo: 'text',
      hole: .5,
      type: 'pie',
      showlegend: false 
    }];

    let layout = {
      shapes: [{
        type: 'path',
        path: path,
        fillcolor: 'ff3300',
        line: {
          color: 'ff3300'
        }
      }],
      title: '<b>Belly Button Washing Frequency</b><br>Scrubs per Week',
      height: 500,
      width: 500,
      xaxis: {zeroline: false, showticklabels: false, showgrid: false, range: [-1, 1]},
      yaxis: {zeroline: false, showticklabels: false, showgrid: false, range: [-1, 1]}
    };

    Plotly.newPlot("gauge", data, layout);

  });
}

/**
 * Generate pie and bubble plot for selected sample ID
 * @param {*} sample sample ID
 */
function buildDataCharts(sample) {
  
  d3.json(`/samples/${sample}`).then((d) => {
    
    // Variables obtained from "app.py" to generate the plots
    let sampleValues = d.sample_values;
    let otuIds = d.otu_ids;
    let otuLabels = d.otu_labels;

    // .......... Pie plot ..........//
    let tracePie = {
      values: sampleValues.slice(0, 10),
      labels: otuIds.slice(0, 10),
      type: "pie",
      hovertext: otuLabels.slice(0, 10)
    };
    let layoutPie = {
      // <strong></strong> does not work here
      title: "<b>Belly Button OTUs - Pie Chart</b><br>Up to 10 most prevalent species"
    };
    let dataPie = [tracePie];
    Plotly.newPlot("pie", dataPie, layoutPie);

    // .......... Bubble plot ..........//
    let traceBub = {
      x: otuIds,
      y: sampleValues,
      mode: "markers",
      marker: {
        size: sampleValues,
        color: otuIds
      },
      text: otuLabels
    };
    let layoutBub = {
      // <strong></strong> does not work here
      title: "<b>Belly Button OTUs - Bubble Chart</b><br>All detected species",
      xaxis: {
        title: "OTU ID"
      },
      yaxis: {
        title: "OTU Counts"
      }
    };
    let dataBub = [traceBub];
    Plotly.newPlot("bubble", dataBub, layoutBub);

  });
}

/**
 * Convert "optionValue" to sample ID and pass it to "buildDataCharts()" and "buildMetadata()"
 * @param {*} optionValue Retrieved from index.html >> select >> onchange='optionChanged(this.value)'
 */
function optionChanged(optionValue) {

  // Remove "BB_" from "optionValue" and change its data type to numeric
  newSample = parseInt(optionValue.replace("BB_", ""));
  // Fetch new data each time a new sample is selected
  buildDataCharts(newSample);
  buildMetadata(newSample);
}