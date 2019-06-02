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




function buildMetadata(sample) {

  // Use `d3.json` to fetch the metadata for a sample
  let metaSelector = d3.select("#sample-metadata");
  // Use d3 to select the panel with id of `#sample-metadata`
  d3.json(`/metadata/${sample}`).then((d) => {
    // Use `.html("") to clear any existing metadata
    metaSelector.html("");
    // Use `Object.entries` to add each key and value pair to the panel
    Object.entries(d).forEach(([k, v]) => {
      metaSelector
        .append('div')
        .text(`${k}: ${v}`);
    });

    // "Speed (level)", "Meter point (degrees)", "pointer (radius)", and "Radians" to calculate "x" and "y" for gauge plot
    let level = parseInt(d.WFREQ) * 18;
    let degrees = 180 - level;
    let radius = .5;
    let radians = degrees * Math.PI / 180;

    // Calculate "x" and "y" for gauge plot
    let x = radius * Math.cos(radians);
    let y = radius * Math.sin(radians);

    // Path
    let mainPath = "M -.0 -0.05 L .0 0.05 L ";
    let pathX = String(x);
    let space = " ";
    let pathY = String(y);
    let pathEnd = ' Z';
    let path = mainPath.concat(pathX,space,pathY,pathEnd);

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
      values: [1000/9, 1000/9, 1000/9, 1000/9, 1000/9, 1000/9, 1000/9, 1000/9, 1000/9, 1000],
      rotation: 90,
      text: ['8-9', '7-8', '6-7', '5-6', '4-5', '3-4', '2-3', '1-2', '0-1', ''],
      textinfo: 'text',
      textposition: 'inside',
      marker: {colors:['rgba(14, 127, 0, .5)', 'rgba(110, 154, 22, .5)',
                         'rgba(170, 202, 42, .5)', 'rgba(202, 209, 95, .5)',
                         'rgba(210, 206, 145, .5)', 'rgba(232, 226, 202, .5)',
                         'rgba(230, 230, 230, .5)','rgba(235, 245, 230, .5)',
                         'rgba(255, 255, 230, .5)',
                         'rgba(255, 255, 255, 0)']},
      labels: ['8-9', '7-8', '6-7', '5-6', '4-5', '3-4', '2-3', '1-2', '0-1', ''],
      hoverinfo: 'label',
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

function buildDataCharts(sample) {
  
  d3.json(`/samples/${sample}`).then((d) => {
    
    let sampleValues = d.sample_values;
    let otuIds = d.otu_ids;
    let otuLabels = d.otu_labels;

    // Pie plot
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

    // Bubble plot
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
      title: "<b>Belly Button OTUs - Bubble Chart</b><br>Up to 10 most prevalent species"
    };

    let dataBub = [traceBub];

    Plotly.newPlot("bubble", dataBub, layoutBub);

  });
}

function optionChanged(optionValue) {

  newSample = parseInt(optionValue.replace("BB_", ""));
  // Fetch new data each time a new sample is selected
  buildDataCharts(newSample);
  buildMetadata(newSample);
}
