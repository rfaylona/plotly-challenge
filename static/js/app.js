var jsData;

function init(){
    //ref dropdown element
    var selector = d3.select("#selDataset");
    //use dropdown to populate features
    d3.json("data/samples.json").then((data) =>{
      jsData = data;
        var subjectID = data.names;
        subjectID.forEach((ID) => {
            selector
            .append('option')
            .text(ID)
            .property('value', ID);
        });
    // use 1st sample to build initial plots
    const firstbutton = subjectID[0];
    updateCharts(firstbutton);
    updateMetadata(firstbutton);
    });
}
  //demo panel
  function updateCharts(sample) {    
    d3.json("data/samples.json").then((data) => {
    var samples = data.samples;
    //filter data for obj w/ corresponding sample num
    var filterArray = samples.filter(sampleObject => sampleObject.id == sample);
    var result = filterArray[0];
    var sample_values = result.sample_values;
    //creste OTUs to hold id lables and values
    var otu_ids = result.otu_ids;
    var otu_labels = result.otu_labels; 
    //create plots for bubble chart
    var trace1 = {
        x: otu_ids,
        y: sample_values,
        text: otu_labels,
        mode: 'markers',
        marker: {
        size: sample_values,
        color: otu_ids,
        colorscale:"Portland"
        }
    };
    var data = [trace1];
    var layout = {
        title: 'Bacteria Cultures per Sample',
        showlegend: false,
        hovermode: 'closest',
        xaxis: {title:"OTU (Operational Taxonomic Unit) ID " +sample},
        font: { color: "darkblue", family: "Arial, Helvetica, sans-serif" },
        margin: {t:30}
    };
    Plotly.newPlot('bubble', data, layout); 
    //create bar chart for top ten
    var trace1 = {
        x: sample_values.slice(0,10).reverse(),
        y: otu_ids.slice(0,10).map(otuID => `OTU ${otuID}`).reverse(),
        text: otu_labels.slice(0,10).reverse(),
        name: "Greek",
        type: "bar",
        orientation: "h"
    };
    var data = [trace1];
    var layout = {
        title: "Top Ten OTUs for Individual " +sample,
        margin: {l: 100, r: 100, t: 100, b: 100},
        font: { color: "darkblue", family: "Arial, Helvetica, sans-serif" }
    };
    Plotly.newPlot("bar", data, layout);  
    });
  }
  //clear metadata when new ID is selected
  function updateMetadata(sample) {
    d3.json("data/samples.json").then((data) => {
        var metadata = data.metadata;
        var filterArray = metadata.filter(sampleObject => sampleObject.id == sample);
        var result = filterArray[0];
        var metaPanel = d3.select("#sample-metadata");
        metaPanel.html("");
        Object.entries(result).forEach(([key, value]) => {
            metaPanel.append("h6").text(`${key.toUpperCase()}: ${value}`)
        })
    //create guage chart
    var data = [
      {
        domain: { x: [0, 1], y: [0, 1] },
        marker: {size: 28, color:'85000'},
        value: result.wfreq,
        title: 'Belly Button Washing Frequency<br> Scrubs per Week',
        titlefont: {family: '"Arial, Helvetica, sans-serif'},
        type: "indicator",
        mode: "number+gauge",
        gauge: { 
          axis: { visible: true, range: [0, 10]},
          bar: { color: 'mediumpurple'},
          steps: [
            { range: [0, 2], color: "#c94c4c" },
            { range: [2, 4], color: "#f2ae72" },
            { range: [4, 6], color: "#ffef96" },
            { range: [6, 8], color: "#b1cbbb" },
            { range: [8, 10], color: "#A0DAA9" }
          ]},
      }
    ];
  
    var layout = {
      width: 600,
       height: 450,
       margin: { t: 100, r: 100, l: 100, b: 100 },
       line: {
       color: 'darkblue'
       },
       font: { color: "darkblue", family: "Arial, Helvetica, sans-serif" }
     };
  
    
    Plotly.newPlot("gauge", data, layout);
    });
  }
  
  function optionChanged(newSample) {
    updateMetadata(newSample);
    updateCharts(newSample);
  }
  
  init();
