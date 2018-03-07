/*

  ## Stats Module

  ### Parameters
  * format :: The format of the value returned. (Default: number)
  * style :: The font size of the main number to be displayed.
  * mode :: The aggergate value to use for display
  * spyable ::  Dislay the 'eye' icon that show the last elasticsearch query

*/
define([
  'angular',
  'app',
  'lodash',
  'jquery',
  'kbn',
  'numeral'
], function (
  angular,
  app,
  _,
  $,
  kbn,
  numeral
) {

  'use strict';

  var module = angular.module('kibana.panels.stats', []);
  app.useModule(module);

  module.controller('stats', function ($scope, querySrv, dashboard, filterSrv) {

    $scope.panelMeta = {
      modals : [
        {
          description: "Inspect",
          icon: "icon-info-sign",
          partial: "app/partials/inspector.html",
          show: $scope.panel.spyable
        },
        {
          description: "CSV",
          icon: "icon-table",
          partial: "app/partials/csv.html",
          show: true,
          click: function() { $scope.csv_data = $scope.to_csv(); }
        }
      ],
      editorTabs : [
        {title:'Queries', src:'app/partials/querySelect.html'}
      ],
      status: 'Beta',
      description: 'A statistical panel for displaying aggregations using the Elastic Search statistical facet query.'
    };

    $scope.modes = ['count','min','max','avg','sum','variance','std_deviation','sum_of_squares'];

    var defaults = {
      queries     : {
        mode        : 'all',
        ids         : []
      },
      style   : { "font-size": '24pt'},
      format: 'number',
      mode: 'count',
      display_breakdown: 'yes',
      sort_field: '',
      sort_reverse: false,
      label_name: 'Query',
      value_name: 'Value',
      spyable     : true,
      show: {
        count: true,
        min: true,
        max: true,
        mean: true,
        std_deviation: true,
        sum_of_squares: true,
        total: true,
        variance: true
      }
    };

    _.defaults($scope.panel, defaults);

    $scope.init = function () {
      $scope.ready = false;
      $scope.$on('refresh', function () {
        $scope.get_data();
      });
      $scope.get_data();
    };

    $scope.set_sort = function(field) {
      console.log(field);
      if($scope.panel.sort_field === field && $scope.panel.sort_reverse === false) {
        $scope.panel.sort_reverse = true;
      } else if($scope.panel.sort_field === field && $scope.panel.sort_reverse === true) {
        $scope.panel.sort_field = '';
        $scope.panel.sort_reverse = false;
      } else {
        $scope.panel.sort_field = field;
        $scope.panel.sort_reverse = false;
      }
    };

    $scope.makeAlias = function (q) {
      var alias = q.alias || q.query;
      return btoa(unescape(encodeURIComponent('stats_' + alias)));
    };

    $scope.get_data = function () {
      if(dashboard.indices.length === 0) {
        return;
      }

      $scope.panelMeta.loading = true;

      var request,
        results,
        queries;

      request = $scope.ejs.Request().indices(dashboard.indices);

      $scope.panel.queries.ids = querySrv.idsByMode($scope.panel.queries);
      queries = querySrv.getQueryObjs($scope.panel.queries.ids);

      var filter = filterSrv.getBoolFilter(filterSrv.ids());

      // This could probably be changed to a BoolFilter
      _.each(queries,function(q) {
        filter = filter.should(querySrv.toEjsObj(q));
      });

      request = request
        .size(0)
        .agg(ejs.FilterAggregation('stats')
          .filter(filter)
          .agg(ejs.ExtendedStatsAggregation('stats')
            .field($scope.panel.field)));

      _.each(queries, function (q) {
        var alias64 = $scope.makeAlias(q);
        var aggr = ejs.ExtendedStatsAggregation('stats')
          .field($scope.panel.field);
        var filter = filterSrv.getBoolFilter(filterSrv.ids())
          .must(querySrv.toEjsObj(q));

        request = request
          .size(0)
          .agg(ejs.FilterAggregation(alias64 )
            .filter(filter)
            .agg(aggr));
      });

      // Populate the inspector panel
      $scope.inspector = angular.toJson(JSON.parse(request.toString()),true);

      results = request.doSearch();

      results.then(function(results) {
        $scope.panelMeta.loading = false;
        var value = results.aggregations.stats.stats[$scope.panel.mode];

        var rows = queries.map(function (q) {
          var alias = q.alias || q.query;
          var alias64 = $scope.makeAlias(q);
          var obj = _.clone(q);
          obj.label = alias;
          obj.Label = alias.toLowerCase(); //sort field
          obj.value = results.aggregations[alias64].stats;
          obj.Value = results.aggregations[alias64].stats; //sort field
          return obj;
        });

        $scope.data = {
          value: value,
          rows: rows
        };

        $scope.$emit('render');
      });
    };

    $scope.set_refresh = function (state) {
      $scope.refresh = state;
    };

    $scope.close_edit = function() {
      if($scope.refresh) {
        $scope.get_data();
      }
      $scope.refresh =  false;
      $scope.$emit('render');
    };

    $scope.to_csv = function() {
      var rows = [];

      _.each($scope.data.rows, function(row) {
        rows.push('"' + row.Label + '"' + "," + row.Value);
      });

      return rows.join("\n") + "\n";
    };

    $scope.download_csv = function() {
      var blob = new Blob([$scope.csv_data], { type: "text/csv" });
      // from filesaver.js
      window.saveAs(blob, $scope.panel.title + ".csv");
      return true;
    };

  });

  module.filter('formatstats', function(){
    return function (value,format) {
      switch (format) {
      case 'money':
        value = numeral(value).format('$0,0.00');
        break;
      case 'bytes':
        value = numeral(value).format('0.00b');
        break;
      case 'float':
        value = numeral(value).format('0.000');
        break;
      default:
        value = numeral(value).format('0,0');
      }
      return value;
    };
  });

});
