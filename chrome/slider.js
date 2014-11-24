angular.module('gDPopup', ['gDraft.services', 'angular-c3','ui.router'])

.config(function($stateProvider){

  $stateProvider
    .state('suggestions',{
      templateUrl:'./views/suggestions.html'
    })
    .state('queue',{
      templateUrl:'./views/queue.html'
    })
    .state('teams',{
      templateUrl:'./views/teams.html'
    })

})

.controller('gDController', function($scope, $http, services, c3Factory, $state){
  $scope.suggestions = services.suggestions;
  $scope.user = services.user;
  $scope.state = services.state;
  $scope.lineupSize = services.lineupSize;
  $scope.normalizedTeamStats = {};

  $scope.changeState = function(x){
    //console.log(x);
    $state.go(x);
    //console.log(x);
  };

  $scope.leagueAverages = {
    "TO": 113.58,
    "BLK": 43.44,
    "ST": 62.16,
    "AST": 176.84,
    "REB": 332.6,
    "PTS": 1004.8,
    "3PTM": 54.16,
    "FT%": 0,
    "FTA": 269.2,
    "FTM": 219.8,
    "FG%": 0,
    "FGA": 768,
    "FGM": 365
  };

  // corrected to match yahoo
  $scope.teamStats = {
    "FGM": 0,
    "FGA": 0,
    "FG%": 0,
    "FTM": 0,
    "FTA": 0,
    "FT%": 0,
    "3PTM": 0,
    "PTS": 0,
    "REB": 0,
    "AST": 0,
    "ST": 0,
    "BLK": 0,
    "TO": 0,
  };

  $scope.playerStats = {
    "FGM": 0,
    "FGA": 0,
    "FG%": 0,
    "FTM": 0,
    "FTA": 0,
    "FT%": 0,
    "3PTM": 0,
    "PTS": 0,
    "REB": 0,
    "AST": 0,
    "ST": 0,
    "BLK": 0,
    "TO": 0,
  };

  $scope.opponentStats = {
    "FGM": 0,
    "FGA": 0,
    "FG%": 0,
    "FTM": 0,
    "FTA": 0,
    "FT%": 0,
    "3PTM": 0,
    "PTS": 0,
    "REB": 0,
    "AST": 0,
    "ST": 0,
    "BLK": 0,
    "TO": 0,
  };

  $scope.config = {
    data: {
      columns: [
        [
          'teamStats',
          $scope.teamStats['FGM'],
          $scope.teamStats['FGA'],
          $scope.teamStats["FG%"],
          $scope.teamStats['FTM'],
          $scope.teamStats['FTA'],
          $scope.teamStats['FT%'],
          $scope.teamStats['3PTM'],
          $scope.teamStats['PTS'],
          $scope.teamStats['REB'],
          $scope.teamStats['AST'],
          $scope.teamStats['ST'],
          $scope.teamStats['BLK'],
          $scope.teamStats['TO'],
        ],
        [
          'playerStats',
          $scope.playerStats['FGM'],
          $scope.playerStats['FGA'],
          $scope.playerStats["FG%"],
          $scope.playerStats['FTM'],
          $scope.playerStats['FTA'],
          $scope.playerStats['FT%'],
          $scope.playerStats['3PTM'],
          $scope.playerStats['PTS'],
          $scope.playerStats['REB'],
          $scope.playerStats['AST'],
          $scope.playerStats['ST'],
          $scope.playerStats['BLK'],
          $scope.playerStats['TO'],
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
        categories: ['FGM', 'FGA',	'FG%', 'FTM',	'FTA', 'FT%', '3PTM',	'PTS',	'REB',	'AST',	'ST',	'BLK',	'TO']
      },
      y: {
        max: 120,
        label: "% of League Average"
      }
    },
    size: {
      height: '400',
      width: '275'
    }

  };


  $scope.addPlayerStats = function(){
    $scope.playerStats = this.player;
    console.log(this.player);
    c3Factory.get('chart').then(function(chart) {
      chart.load({
        columns: [
          [
            'playerStats',
            1,
            3,
            3,
            4,
            5,
            6,7,8,9,10,11,12,13
            // $scope.playerStats['FGM'],
            // $scope.playerStats['FGA'],
            // $scope.playerStats["FG%"],
            // $scope.playerStats['FTM'],
            // $scope.playerStats['FTA'],
            // $scope.playerStats['FT%'],
            // $scope.playerStats['3PTM'],
            // $scope.playerStats['PTS'],
            // $scope.playerStats['REB'],
            // $scope.playerStats['AST'],
            // $scope.playerStats['ST'],
            // $scope.playerStats['BLK'],
            // $scope.playerStats['TO'],
          ]
        ],
      });
    });
  }

  $scope.removeStats = function(){
    $scope.playerStats = {};
    c3Factory.get('chart').then(function(chart) {
      chart.unload({
        ids:['playerStats']
      });
    });
    $scope.opponentStats = {};
    c3Factory.get('chart').then(function(chart) {
      chart.unload({
        ids:['opponentStats']
      });
    });
  }

  $scope.addOpponentStats = function(){
    //console.log(this.stats.team,'=====================================');
    $scope.opponentStats = this.stats.team;

    //console.log($scope.opponentStats)

    var FGM = 0;
    var FGA = 0;
    var FG = 0;
    var FTM = 0;
    var FTA = 0;
    var FT = 0;
    var ThreePT = 0;
    var PTS = 0;
    var REB = 0;
    var AST = 0;
    var ST = 0;
    var BLK = 0;
    var TO = 0;



    for (key in $scope.opponentStats) {
      FGM += parseInt($scope.opponentStats[key].FGM)
      FGA += parseInt($scope.opponentStats[key].FGA)
      FTM += parseInt($scope.opponentStats[key].FTM)
      FTA += parseInt($scope.opponentStats[key].FTA)
      ThreePT += parseInt($scope.opponentStats[key]['3PTM'])
      PTS += parseInt($scope.opponentStats[key].PTS)
      REB += parseInt($scope.opponentStats[key].REB)
      AST += parseInt($scope.opponentStats[key].AST)
      ST += parseInt($scope.opponentStats[key].ST)
      BLK += parseInt($scope.opponentStats[key].BLK)
      TO += parseInt($scope.opponentStats[key].TO)
    };

    //console.log('stats', FGM, FGA, FTM, FTA, ThreePT, PTS, REB, AST, ST, BLK, TO)

    FG = FGM*100/FGA;
    FT = FTM*100/FTA;

    c3Factory.get('chart').then(function(chart) {
      chart.load({
        columns: [
          [
            'opponentStats',
            FGM* 100 / ($scope.leagueAverages['FGM'] * $scope.lineupSize),
            FGA* 100 / ($scope.leagueAverages['FGA'] * $scope.lineupSize),
            FG,
            FTM* 100 / ($scope.leagueAverages['FTM'] * $scope.lineupSize),
            FTA* 100 / ($scope.leagueAverages['FTA'] * $scope.lineupSize),
            FT,
            ThreePT * 100 / ($scope.leagueAverages['3PTM'] * $scope.lineupSize),
            PTS* 100 / ($scope.leagueAverages['PTS'] * $scope.lineupSize),
            REB* 100 / ($scope.leagueAverages['REB'] * $scope.lineupSize),
            AST* 100 / ($scope.leagueAverages['AST'] * $scope.lineupSize),
            ST* 100 / ($scope.leagueAverages['ST'] * $scope.lineupSize),
            BLK* 100 / ($scope.leagueAverages['BLK'] * $scope.lineupSize),
            TO* 100 / ($scope.leagueAverages['TO'] * $scope.lineupSize)
          ]
        ],
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

  $scope.updateState = function() {

  };

  $scope.normalize = function() {
    for (var category in $scope.teamStats) {
      $scope.normalizedTeamStats[category] = ($scope.teamStats[category] * 100) / ($scope.leagueAverages[category] * $scope.lineupSize);
    }
    $scope.normalizedTeamStats['FT%'] = $scope.teamStats['FTM'] * 100 / $scope.teamStats['FTA'];
    $scope.normalizedTeamStats['FG%'] = $scope.teamStats['FGM'] * 100 / $scope.teamStats['FGA'];
  };

  // refactor this to a service

  // service has a callback list
  // and this.onMessage function to store a callback
  window.addEventListener("message", function(event){$scope.$apply(receiveMessage(event))}, false);

  function receiveMessage(event) {
    //console.log("=======================message received in slider.js!======================");
    //console.log(event.data);
    if (event.data.user) {
      $scope.user = event.data.user;
    }

    if (event.data.queue) {
      //console.log('=============== queue received! ====================');
      $scope.queue = event.data.queue;
      services.getSuggestions($scope.state).then(function(data) {
        //console.log('yoyoyoyo');
      });
    }

    if (event.data.state) {
      if (!$scope.user) {
        //console.log("error: user not set");
      }
      else {
        // reset scope and teamStats
        $scope.state = event.data.state;
        $scope.teamStats = {
          "FGM": 0,
          "FGA": 0,
          "FG%": 0,
          "FTM": 0,
          "FTA": 0,
          "FT%": 0,
          "3PTM": 0,
          "PTS": 0,
          "REB": 0,
          "AST": 0,
          "ST": 0,
          "BLK": 0,
          "TO": 0
        };

        var state = $scope.state;
        var user = $scope.user;
        //console.log(user);
        //console.log(state[user]);
        for (var key in state[user].team) {
          var player = state[user].team[key];
          //console.log(player);
          for (var stat in player) {
            var data = player[stat];
            $scope.teamStats[stat] += parseFloat(data);
          }
        }
        //console.log($scope.teamStats);
      }

      // update angular bindings
      $scope.$digest();

      $scope.normalize();

      c3Factory.get('chart').then(function(chart) {
        chart.load({
          columns: [
            [
              'teamStats',
              $scope.normalizedTeamStats['FGM'],
              $scope.normalizedTeamStats['FGA'],
              $scope.normalizedTeamStats["FG%"],
              $scope.normalizedTeamStats['FTM'],
              $scope.normalizedTeamStats['FTA'],
              $scope.normalizedTeamStats['FT%'],
              $scope.normalizedTeamStats['3PTM'],
              $scope.normalizedTeamStats['PTS'],
              $scope.normalizedTeamStats['REB'],
              $scope.normalizedTeamStats['AST'],
              $scope.normalizedTeamStats['ST'],
              $scope.normalizedTeamStats['BLK'],
              $scope.normalizedTeamStats['TO'],
            ],
          ],
        });
      });
    }
  }
});
