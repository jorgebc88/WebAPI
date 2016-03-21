var app = angular.module('app.objectService',[]);

app.service('objectService', ['$http', function ($http){
  var detectedObject = function () {
    return $http.get('http://localhost:8080/REST-API/detectedObject/requestDetectedObject');
  };

  var searchObjects = function(startDate, endDate, id) {
    return $http.get('http://localhost:8080/REST-API/detectedObject/requestDetectedObjectByDatesBetweenAndCameraId?startDate=' + startDate + '&endDate=' + endDate + '&cameraId=' + id);
  };

  return {
    detectedObject : detectedObject,
    searchObjects : searchObjects
  }
}]);