# plotly-challenge
## Belly-Button Biodiversity Study

The challenge was to display participant information in various formats.  This is a an image of the study results for participant 940.  The participant selection drop-down sits in the upper left.  A list of participant attributes sits below the drop-down.  In the top center, a horizontal bar chart lists the top ten bacteria identified in the participant's belly button, labeled by their operarational taxonomic unit (OTU).  The upper right holds a gauge display of the weekly washings.  A large chart, of all the bacteria found in the participants belly button, stretches across the bottom of the site.

![site](C:\Users\norma\HDD_Documents\BootCamp\Assignments\15-Interactive-Visualizations-and-Dashboards\plotly-challenge\site.png)

### Metadata Panel
The data set contains eight meta-data attributes for each participant.  I chose to show only the second through seventh attributes.  

![metadata](C:\Users\norma\HDD_Documents\BootCamp\Assignments\15-Interactive-Visualizations-and-Dashboards\plotly-challenge\metadata.png)

The first attribute, participant id, is already shown in the drop-down just above the Metadata Panel.  The eighth attribute, weekly washing frequency, is shown in the Weekly Washing Frequency Gauge.

### Top N Bacteria Chart
The purpose of the chart is to show the top ten most populous bacteria.  For some participants, the data set has less than ten bacteria; even no bacteria.  It took some effort to maintain a consistent look for those participants, and to inform the viewer when no bacteria were present in the data set.

![top_n_bacteria](C:\Users\norma\HDD_Documents\BootCamp\Assignments\15-Interactive-Visualizations-and-Dashboards\plotly-challenge\top_n_bacteria.png)



![top_0_bacteria](C:\Users\norma\HDD_Documents\BootCamp\Assignments\15-Interactive-Visualizations-and-Dashboards\plotly-challenge\top_0_bacteria.png)

### Weekly Washing Frequency Gauge

This gauge could be implemented with either a gauge or a pie chart with a hollow core.  I found the code online for the hollow-core pie chart, but I preferred the gauge, especially because the weekly washing frequency was discrete (integer, not fractional), and I like the digital display (like the speedometer on my '86 Celica).

![gauge](C:\Users\norma\HDD_Documents\BootCamp\Assignments\15-Interactive-Visualizations-and-Dashboards\plotly-challenge\gauge.png)

Either approach required a custom needle.  I chose a simple line, and shaded it gray, to differentiate it from the numeral.  For the gauge, I chose to repeat the blue bar color used in the Top N Bacteria Chart.  The ColorPick EyeDropper Chrome extension made this easy.  To provide a gradient of color between the zero and ten, the saturation number of the HSL color scale worked well, to precisely control the gradient, and to match the hue of the blue bar color.  This gauge implementation carefully differentiates between data that reports zero weekly washings, and null weekly washings.

### Bacteria Scatter Plot

The scatter plot of all bacteria found in the participant's belly button uses three features to enhance readability.  The size of each data point marker is scaled by the bacteria count.  The color of each data point marker is altered across the OTU spectrum of bacteria.  The vertical axis is logarithmic, to provide more separation among the less-populous bacteria.

![scatter_plot](C:\Users\norma\HDD_Documents\BootCamp\Assignments\15-Interactive-Visualizations-and-Dashboards\plotly-challenge\scatter_plot.png)

For marker size, I chose to use an offset to establish a reasonably visible (prominent) marker for even the least populous bacteria.  The HSL color scale was convenient for the color scale.  I like the separation provided by the logarithmic scale.  I did not like the logarithmic labeling; [2, 5, 10, 2, 5, 100, 2, 5], where the meaning of the [2, 5] numbers depend on the nearly 10 or 100.  I could not find a simple solution to get the [2, 5, 10, 20, 50, 100, 200, 500] labels that I desired (without hard-coding).

#### The data comes from this study:

Hulcr, J. et al.(2012) _A Jungle in There: Bacteria in Belly Buttons are Highly Diverse, but Predictable_. Retrieved from: [http://robdunnlab.com/projects/belly-button-biodiversity/results-and-data/](http://robdunnlab.com/projects/belly-button-biodiversity/results-and-data/)