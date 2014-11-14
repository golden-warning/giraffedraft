angular.module('gDPopup', ['gDraft.services', 'angular-c3'])

.controller('gDController', function($scope, $http, services, c3Factory){
  $scope.undrafted = [];
  $scope.suggestions = [];
  $scope.drafted = [];

  $scope.leagueAverages = {
    "MIN":48*82,
    "3PM":7.5*82,
    "FG%":0.5,
    "BLK":4.8*82,
    "STL":7.2*82,
    "AST":21.2*82,
    "GP":82,
    "REB":42.1*82,
    "FT%":0.5,
    "PTS":99.4*82,
    "TO":14.9*82
  };

  $scope.teamStats = {
    "MIN":0,
    "3PM":0,
    "FG%":0,
    "BLK":0,
    "STL":0,
    "AST":0,
    "GP":0,
    "REB":0,
    "FT%":0,
    "PTS":0,
    "TO":0
  };

  $scope.playerStats = {
    "MIN":0,
    "3PM":0,
    "FG%":0,
    "BLK":0,
    "STL":0,
    "AST":0,
    "GP":0,
    "REB":0,
    "FT%":0,
    "PTS":0,
    "TO":0
  };

  $scope.config = {
    data: {
      columns: [
        [
          'teamStats',
          $scope.teamStats.MIN,
          $scope.teamStats['3PM'],
          $scope.teamStats['FG%'],
          $scope.teamStats.BLK,
          $scope.teamStats.STL,
          $scope.teamStats.AST,
          $scope.teamStats.GP,
          $scope.teamStats.REB,
          $scope.teamStats['FT%'],
          $scope.teamStats.PTS,
          $scope.teamStats.TO
        ],
        [
          'playerStats',
          $scope.playerStats.MIN,
          $scope.playerStats['3PM'],
          $scope.playerStats['FG%'],
          $scope.playerStats.BLK,
          $scope.playerStats.STL,
          $scope.playerStats.AST,
          $scope.playerStats.GP,
          $scope.playerStats.REB,
          $scope.playerStats['FT%'],
          $scope.playerStats.PTS,
          $scope.playerStats.TO
        ]
      ],
      type: 'bar',
      groups: [
        ['playerStats', 'teamStats']
      ]
    },
    axis: {
      x: {
        height:60,
        max: 11,
        type: 'category', 
        tick:{
          rotate:90
        },
        categories: ['MIN', '3PM', 'FG%', 'BLK','STL','AST','GP','REB','FT%','PTS','TO']
      },
      y: {
        max: 1000
      }
    },
    size: {
      height: '600',
      width: '250'
    }

  };



  // $http.get('http://giraffedraft.azurewebsites.net/api/init').
  // // success(function(data, status, headers, config){
  // //   $scope.undrafted = data;
  // //   $scope.calculate();

  // // }).
  // error(function(data, status, headers, config){
  //   console.log('failed!!!!!!!!!!!')
  // })

  services.loadPlayers()
  .then(function(data){
    console.log(data);
    $scope.undrafted = data;
    // $scope.calculate();
  });

  // $scope.calculate = function(){
  //   services.getSuggestions($scope.undrafted)
  //     .then(function(data){
  //       $scope.suggestions = data;
  //     })
  // }

  $scope.markDrafted = function(){
    $scope.drafted.push(this.player)
    var ind = $scope.undrafted.indexOf(this.player)
    $scope.undrafted.splice(ind,1);
    for(key in this.player) {
      if (key !== "NAME" && key !== "Player") {
        $scope.teamStats[key] += parseInt(this.player[key]);
      }
    }

    console.log($scope.teamStats);

    c3Factory.get('chart').then(function(chart) {
      chart.load({
        columns: [
          [
            'teamStats',
            $scope.teamStats.MIN,
            $scope.teamStats['3PM'],
            $scope.teamStats['FG%'],
            $scope.teamStats.BLK,
            $scope.teamStats.STL,
            $scope.teamStats.AST,
            $scope.teamStats.GP,
            $scope.teamStats.REB,
            $scope.teamStats['FT%'],
            $scope.teamStats.PTS,
            $scope.teamStats.TO
          ]
        ],
      });
    });

    // $scope.calculate();
  }

  $scope.addPlayerStats = function(){
    $scope.playerStats = this.player
    console.log(this.player)
    c3Factory.get('chart').then(function(chart) {
      chart.load({
        columns: [
          [
            'playerStats',
            $scope.playerStats.MIN,
            $scope.playerStats['3PM'],
            $scope.playerStats['FG%'],
            $scope.playerStats.BLK,
            $scope.playerStats.STL,
            $scope.playerStats.AST,
            $scope.playerStats.GP,
            $scope.playerStats.REB,
            $scope.playerStats['FT%'],
            $scope.playerStats.PTS,
            $scope.playerStats.TO
          ]
        ],
      });
    });
  }

  $scope.removePlayerStats = function(){
    $scope.playerStats = {};
    c3Factory.get('chart').then(function(chart) {
      chart.unload({
        ids:['playerStats']
      });
    });
  }

  // var svg = d3.select("body").append("svg")
  //   .attr("width", "1000")
  //   .attr("height", "1000")
  //   .attr("fill", "blue")
  //

  // update: will be called on each ng-click or ng-mouseover event.
  // should use the
  // $scope.update = function() {
  //   console.log('updating');
  //   var data = [];
  //   console.log(Object.keys($scope.teamStats));
  //   for (key in $scope.teamStats) {
  //     if (key !== '$$hashKey') {
  //       data.push($scope.teamStats[key]);
  //     }
  //   };
  //
  //   console.log(data);
  //
  //   var graph = svg.selectAll("rect")
  //     .data(data, function(d) {return d;})
  //   console.log(graph);
  //
  //   graph.enter().append("rect")
  //     .attr('width', function(d) { return d; })
  //     .attr('height', 10)
  //     .attr('fill','blue')
  //     .attr('y', function(d, i) { return i * 10; })
  // }
});
