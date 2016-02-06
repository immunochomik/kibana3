# Kibana
This is an attempt to support Kibana 3 as I find it nice and easier to work with than Kibana 4. This fork of kibana 3 does work against Elasticsearch 2.1 that was actually main point of the fork, the purpose was to make it to talk aggregations instead of facets.

Following panels are already done and working:
- terms,
- histogram,
- stats,
- table,
- goal

If you are anything like me and need kibana tool to get quick insight into what is going on in access or error logs, then kibana 3 is better choice than kibana 4 and this fork of it is already working and ready to use.

Kibana 4 has the discovery panel in it witch is suppose to allow just that (logs discovery), but simple dashboard build in kibana 3 with the time histogram, few terms panels and documents table pane are vastly superior in providing the insight that you need. 
And if you need to point that dashboard onto different index, - nothing is simpler as you have dashboard level index definition. Whereas in K4 you need to go and change that index in all the visualisations separately, just pure joy.  


## Installation
I have no idea about proper javascript development as I am a PHP guy, so I can not advise about grunt or gulp or whatever.
To install the project just download it and serve with any web server, where src dir being the root, as you want them to get src/index.html.
You need to point it at the elasticsearch in src/config.js and then it just work.
