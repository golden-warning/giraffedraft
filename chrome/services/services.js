;(function() {
  "use strict";

  angular
    .module('gDraft.services', [])
    .factory('services',

      function ($http) {

        var suggestions = [];
        var normalizedTeamStats = {};
        var lineupSize = 12;
        var user = '';

        var state = {
          hossein: {"2":{"injured":false,"ADP":"2.6","FGM":"583","FGA":"1102","FG%":".530","FTM":"326","FTA":"411","FT%":".793","3PTM":"2.5","PTS":"1496","REB":"682","AST":"112","ST":"107","BLK":"202","TO":"110","playerName":"Anthony Davis NO - PF,C"}},
          'Team 12': {
            "12":{"injured":false,"ADP":"14.5","FGM":"608","FGA":"1222","FG%":".498","FTM":"172","FTA":"236","FT%":".728","3PTM":"1.6","PTS":"1389","REB":"675","AST":"136","ST":"59.5","BLK":"87.0","TO":"94.9","playerName":"Al Jefferson Cha - PF,C"},
            "17":{"injured":false,"ADP":"20.9","FGM":"462","FGA":"967","FG%":".478","FTM":"345","FTA":"422","FT%":".819","3PTM":"65.7","PTS":"1336","REB":"556","AST":"137","ST":"65.7","BLK":"61.2","TO":"122","playerName":"Chris Bosh Mia - PF,C"}}
          };

        function emptyArray(array) {
          while (array.length > 0) {
            array.pop();
          }
        }

        function copyArray(array, destArray) {
          while (array.length > 0) {
            destArray.push(array.pop());
          }
        }

        function getSuggestions(undrafted){
          return $http.post('http://shotcaller-api.cloudapp.net/api/suggest', undrafted)
            .then(function(data, status, headers,config) {
              //console.log(data.data);
              emptyArray(suggestions);
              copyArray(data.data, suggestions);
              return data.data;
            });
        }

        return {
          getSuggestions: getSuggestions,
          // what happens if suggestions: []?
          suggestions: suggestions,
          state: state,
          normalizedTeamStats: normalizedTeamStats,
          lineupSize: lineupSize,
          user: user
        };
      }
    );
}).call(this);
