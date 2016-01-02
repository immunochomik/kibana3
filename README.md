# Kibana
This is an attempt to support Kibana 3 as I find it nice and easier to work with than Kibana 4. This fork of kibana 3 does work against Elasticsearch 2.1 that was actually main point of the fork, the purpose was to make it to talk aggregations instead of facets.

Following panels are already done and working:
- terms,
- histogram,
- stats,
- table,
- goal,

It is actually all the functionality that I need to have basic what is going on look into our access logs and error logs and event logs,


I am going to try to add missing panels:
- histograms that are not time based,
- data table as in Kibana 4,


## Installation
I have no idea about proper javascript development as I am a PHP guy, so I can not advise about grunt or gulp or whatever.
To install the project just download it and serve with any web server, where src dir being the root, as you want them to get src/index.html
you need to point it at the elastic search in src/config.js and then it just work.