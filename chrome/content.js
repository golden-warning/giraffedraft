angular.module('gDraft',[])

.controller('gDController', function($scope, $http){
  $http.get('http://giraffedraft.azurewebsites.net/api/init').
  success(function(data, status, headers, config){
    $scope.players = data;
  }).
  error(function(data, status, headers, config){
    console.log('failed!!!!!!!!!!!')
  })

  $scope.suggestions = [{NAME:'Stephen Curry'}, {NAME:'Lebron James'}, {NAME: 'Anthony Davis'}];
  $scope.drafted = [];

  $scope.calculate = function(){
    $http.post('http://giraffedraft.azurewebsites.net/api/suggest', $scope.drafted).
    success(function(data, status, headers, config) {
      $scope.suggestions = data;
    }).
    error(function(data, status, headers, config) {
      console.log('doesnot work');
    });
  }

  //$scope.calculate();

  $scope.markDrafted = function(){
    $scope.drafted.push(this.player)
  }
});
