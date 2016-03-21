var app = angular.module('app.cameraService',[]);

app.service('cameraService', ['$http', function ($http){
  var cameraList = function () {
    return $http.get('http://localhost:8080/REST-API/camera/list');
  };

  return {
    cameraList : cameraList
  }
}]);