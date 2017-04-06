# Kibana
This is the best and only Kibana 3 that is working with no joke Elasticsearch 5 

Following panels are already done and working:
- time histogram,
- terms,
- stats,
- table

Now unique count (cardinality aggregation) is supported in time histograms and terms. 

If you are anything like me and need kibana tool to get quick insight into what is going on in access or error logs, then kibana 3 is better choice than kibana 4 and this fork of it is already working and ready to use.

Kibana 4 has the discovery panel in it witch is suppose to allow just that (logs discovery), but simple dashboard build in kibana 3 with the time histogram, few terms panels and documents table pane are vastly superior in providing the insight that you need. 
And if you need to point that dashboard onto different index, - nothing is simpler as you have dashboard level index definition. Whereas in K4 you need to go and change that index in all the visualisations separately, just pure joy.  


## Installation
There is not build process so just serve the content of src folder with a web server
