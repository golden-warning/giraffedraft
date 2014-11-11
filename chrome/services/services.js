;(function() {
  "use strict";

  angular
    .module('gDraft.services', [])
    .factory('init',

      function ($http) {
        function loadPlayers(players){
        return $http.get('http://giraffedraft.azurewebsites.net/api/init').
        then(function(data, status, headers, config) {

          return data.data;

        });

      }
      return {
        loadPlayers: loadPlayers
      };
    });

}).call(this);