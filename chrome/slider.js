angular.module('gDPopup', ['gDraft.services', 'angular-c3'])

.controller('gDController', function($scope, $http, services, c3Factory){
  $scope.undrafted = [];
  $scope.suggestions = [];
  $scope.drafted = [];

  $scope.teamStats = {
    "MIN":20,
    "3PM":100,
    "FG%":30,
    "BLK":50,
    "STL":40,
    "AST":60,
    "GP":70,
    "REB":80,
    "FT%":90,
    "PTS":20,
    "TO":20
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
        ]
      ],
      type: 'bar',
      groups: [
        []
      ]
    },
    axis: {
      rotated: true
    },
    size: {
      height: '400',
      width: '400'
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
    $scope.calculate();
  });

  $scope.calculate = function(){
    services.getSuggestions($scope.undrafted)
      .then(function(data){
        $scope.suggestions = data;
      })
  }

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

    $scope.calculate();
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
