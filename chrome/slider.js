angular.module('gDPopup', ['gDraft.services'])

.controller('gDController', function($scope, $http, init){

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

  init.loadPlayers().then(function(data){
    $scope.undrafted = data;
    // yeah boyyyeeeeee
    $scope.calculate();
  });

  $scope.calculate = function(){
    $http.post('http://giraffedraft.azurewebsites.net/api/suggest', $scope.undrafted).
    success(function(data, status, headers, config) {
      $scope.suggestions = data;
    }).
    error(function(data, status, headers, config) {
      console.log('does not work', $scope.undrafted);
    });
  }

  $scope.markDrafted = function(){
    console.log('undrafted', this.player)
    $scope.drafted.push(this.player)
    var ind = $scope.undrafted.indexOf(this.player)
    $scope.undrafted.splice(ind,1);
    $scope.calculate();
  }
});
