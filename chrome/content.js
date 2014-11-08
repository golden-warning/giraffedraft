angular.module('gDraft',[])

.controller('gDController', function($scope, $http){
	$scope.person = {
		name: "Warren"
	};
	$scope.calculate = function(){
		$http.get('http://giraffedraft.azurewebsites.net/api/init').
		success(function(data, status, headers, config){
			console.log(data)
			$scope.person.name = data[0].NAME;
		}).
		error(function(data, status, headers, config){
			console.log('failed!!!!!!!!!!!')
		})
	}
});