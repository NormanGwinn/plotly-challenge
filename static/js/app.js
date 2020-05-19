// This global variable will persist the data for the duration of the web application
var participantData;

// This is the initialization code.  
//   Read data from the samples.json file.
//   When the data is completely read:
//     Populate the drop-down menu options.
//     Store the data into a globally-scoped variable.
//     Update the various charts on the page, with the data from the first participant.
d3.json("static/data/samples.json").then(data => {
    console.log("Have Data")
    d3.select("#selDataset").html(data.names.map((sId, idx) => `<option value="${idx}">${sId}</option>`).join(""));
    participantData = data;
    optionChanged(0);
});

// This is the event handler, specified in the index.html.
// This function delegates the work to four other functions, one for each display panel.
function optionChanged(participantIndex) {
  updateMetadata(participantIndex);
  updateBarChart(participantIndex);
  updateGauge(participantIndex);
  updateScatterPlot(participantIndex);
}

// Update the meta-data panel; the participant information
function updateMetadata(participantIndex) {
  // Construct a list of the meta-data items, omitting the first and last items
  let data2show = Object.entries(participantData.metadata[participantIndex])
                        .map((entry) => `${entry[0]}:  ${entry[1]}`)
                        .slice(1,6);
  
  // Use the enter and exit pattern to populate the meta-data panel
  let selection = d3.select("#sample-metadata").selectAll("li")
        .data(data2show);

  selection.enter()
        .append("li")
        .merge(selection)
        .text(function(d) {return d;});

  selection.exit().remove();
}

// Update the horizontal bar chart
function updateBarChart(participantIndex) {
  // Collect the data, labels, and hover text
  let bacteria_count = participantData.samples[participantIndex].sample_values.slice(0,10);
  let bacteria_id = participantData.samples[participantIndex].otu_ids.slice(0,10).map(id => "OTU-"+String(id));
  let bacteria_label = participantData.samples[participantIndex].otu_labels.slice(0,10);

  // Set a chart title, appropriate for one or more sample bacteria
  let chart_title = `Top ${bacteria_count.length} Belly Button Bacteria`;

  // Handle the special case where no samples are found in the dataset
  if (bacteria_count.length == 0) {
    bacteria_count.push(0.0);
    bacteria_id.push("(No Data) ");
    chart_title = "No Bacteria Counts Recorded";
  }

  // If less than ten samples are found, synthesize "filler" data
  while (bacteria_count.length < 10) {
    bacteria_count.push(0.0);
    bacteria_id.push(" ".repeat(bacteria_count.length));
    bacteria_label.push("");
  }

  // Plot the counts of the bacteria samples
  var trace1 = {
    type: "bar",
    orientation: "h",
    x: bacteria_count.reverse(),
    y: bacteria_id.reverse(),
    text: bacteria_label.reverse()
  };

  var layout = {
    title:  { text: chart_title, font: {size: 20} } ,
    xaxis: { title: 'Bacteria Count', rangemode: 'tozero'},
    yaxis: { title: 'Bacteria ID'}
  };

  var data = [trace1];
  Plotly.newPlot("bar", data, layout)
}

// Update the gauge
function updateGauge(participantIndex) {
  // Collect the data
  let washing_frequency_data = participantData.metadata[participantIndex].wfreq;
  
  // Convert the frequency to an integer
  let washing_frequency_display = Math.round(washing_frequency_data);

  // Set a title, and handle the null data case
  let gauge_title = "Weekly Washing Frequency";
  if (washing_frequency_data == null) {
    washing_frequency_display = "";
    gauge_title += " is Unknown";
  }

  // Create the gauge
  var data = [
    {
      domain: { x: [0, 1], y: [0, 1] },
      value: washing_frequency_display,
      title: { text: gauge_title, font: {size: 20} },
      type: "indicator",
      mode: "gauge+number",
      gauge: {
        axis: { range: [null, 10] },
        bar: {color: "rgba( 51,122,183,1.0)"},
        steps: [
          { range: [0, 1], color: "rgba( 51,122,183,0.25)" },
          { range: [1, 2], color: "rgba( 51,122,183,0.30)" },
          { range: [2, 3], color: "rgba( 51,122,183,0.35)" },
          { range: [3, 4], color: "rgba( 51,122,183,0.40)" },
          { range: [4, 5], color: "rgba( 51,122,183,0.45)" },
          { range: [5, 6], color: "rgba( 51,122,183,0.50)" },
          { range: [6, 7], color: "rgba( 51,122,183,0.55)" },
          { range: [7, 8], color: "rgba( 51,122,183,0.60)" },
          { range: [8, 9], color: "rgba( 51,122,183,0.65)" },
          { range: [9,10], color: "rgba( 51,122,183,0.70)" }
        ],
      }
    }
  ];

  var layout = { width: 600, height: 450, margin: { t: 0, b: 0 } };

  // Draw a line that appears to be a needle on the gauge
  if (washing_frequency_data != null) {
    let line_length = 0.5;
    let angle = Math.PI * (1 - washing_frequency_data/10.0);
    let x_offset = line_length * Math.cos(angle);
    let y_offset = line_length * Math.sin(angle);
    layout.shapes = [{
      type: 'line',
      x0: 0.5,
      y0: 0.25,
      x1: 0.5 + x_offset,
      y1: 0.25 + y_offset,
      line: {
        color: 'rgba(0,0,0,0.25)',
        width: 3
      }
    }];
  }

  Plotly.newPlot('gauge', data, layout);
}

// Update the scatter plot
function updateScatterPlot(participantIndex) {
  // Collect the data, labels, and hover text
  let bacteria_count = participantData.samples[participantIndex].sample_values;
  let bacteria_id = participantData.samples[participantIndex].otu_ids;
  let bacteria_label = participantData.samples[participantIndex].otu_labels;

  // Set an appropriate chart title
  let chart_title = "Bacterial Spectrum" + (bacteria_count.length == 0 ? " (No Data)" : "");

  // Plot the bacteria samples
  var trace1 = {
    type: "scatter",
    mode: "markers",
    x: bacteria_id,
    y: bacteria_count,
    text: bacteria_label,
    marker: {
      size: bacteria_count.map(c => 10+0.5*c),
      color: bacteria_id.map(id => `hsla(${0.1*id},100%,60%,0.8)`)
    }
  };

  var layout = {
    title: { text: chart_title, font: {size: 20} },
    xaxis: { title: 'Bacteria "OTU-" ID'},
    yaxis: { title: 'Bacteria Count (Logarithmic)', type: "log"}
  };

  Plotly.newPlot("bubble", [trace1], layout)
}

