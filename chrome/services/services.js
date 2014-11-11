;(function() {
  "use strict";

  angular
    .module('gDraft.services', [])
    .factory('init',

      function ($http) {
        function loadPlayers(players){
        return $http.get('http://giraffedraft.azurewebsites.net/api/init').
        then(function(data, status, headers, config) {
          // .undrafted = data;
          // .allPlayers = angular.copy(data);
          // // for(var i = 0; i < undrafted.length; i++){
          // //   undrafted[i].drafted = false;
          // // }
          // $scope.calculate();

          return data.data;

        });

      }
      return {
        init: loadPlayers
      };
    });

}).call(this);