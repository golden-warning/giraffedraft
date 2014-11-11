;(function() {
  "use strict";

  angular
    .module('gDraft.services', [])
    .factory('services',

      function ($http) {

        function loadPlayers(players){
	      return $http.get('http://giraffedraft.azurewebsites.net/api/init')
	        .then(function(data, status, headers, config) {

	        return data.data;

	      });

        }

        function getSuggestions(undrafted){
          return $http.post('http://giraffedraft.azurewebsites.net/api/suggest', undrafted)
            .then(function(data, status, headers,config) {
            	return data.data;
            })

        }

      return {
        loadPlayers: loadPlayers,
        getSuggestions: getSuggestions
      };
    });

}).call(this);