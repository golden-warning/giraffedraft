angular.module('gDPopup', ['gDraft.services'])

.controller('gDController', function($scope, $http, services  ){

  $scope.undrafted = [];
  $scope.suggestions = [];
  $scope.drafted = [];

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
    $scope.calculate();
  }
});
