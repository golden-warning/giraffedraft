angular.module('gDraft', ['pageslide-directive', 'gDraft.services'])
  
  $http.get('http://giraffedraft.azurewebsites.net/api/init').
  success(function(data, status, headers, config){
    $scope.undrafted = data;
    $scope.allPlayers = angular.copy(data);
    // for(var i = 0; i < undrafted.length; i++){
    //   undrafted[i].drafted = false;
    // }
    $scope.calculate();

  }).
  error(function(data, status, headers, config){
    console.log('failed to get initial players')
  })