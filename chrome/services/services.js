;(function() {
  "use strict";

  angular
    .module('gDraft.services', [])
    .factory('services',

      function ($http) {

        function getRequest(link){
	      return $http.get(link)
	        .then(function(data, status, headers, config) {

	        return data;

	      });

        }

        function getSuggestions(undrafted){
          return $http.post('http://giraffedraft.azurewebsites.net/api/suggest', undrafted)
            .then(function(data, status, headers,config) {
            	return data.data;
            })

        }

      return {
        getRequest: getRequest,
        getSuggestions: getSuggestions
      };
    });

}).call(this);