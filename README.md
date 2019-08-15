Belly-Button-Biodiversity
<h3><strong>INTERACTIVE DASHBOARD</strong></h3>
<p>The deployment of an interactive dashboard for the abundance of different microbial species (technical term: operational taxonomic units, <strong>OTUs</strong>) in human belly buttons was based on the <a href="./db">dataset</a> retrieved from the <a href="http://robdunnlab.com/projects/belly-button-biodiversity/"><i>Belly Button Biodiversity</i></a> study launched in January 2011 by Dr. Robert R. Dunn from North Carolina State University.</p><br/>

<h3><strong>METHODOLOGY</strong></h3>
<p>Flask app functions as a server to receive request from index.html (customer interface), set up connections to database (sqlite), retrieve data from database, process data, and send back data of interest in response to "d3.json()" calls from javascript file. Data are then processed by javascript and eventually displayed in index.html as mega data box as well as in the form of 'pie', 'gauge', and 'bubble' charts plotted by Plotly.js.</p>
<p>Such application is deployed on Heroku and can be accessed <a href="https://koudash-biodiversity.herokuapp.com/">here</a>.
