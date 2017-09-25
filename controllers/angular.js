var myApp = angular.module("myApp", []);
myApp.controller("myCtrl", function($scope, $http) {
  $scope.songs = [];

  $http.get("/songs")
  .then(function(result) {
    console.log(result);
    $scope.songs = result.data;
  })
});
