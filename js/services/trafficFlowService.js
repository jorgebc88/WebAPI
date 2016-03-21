var app = angular.module('app.trafficFlowService',[]);

app.service('trafficFlowService', ['$http', function ($http){
  var peakHoursByDaysOfTheWeekAndCamera = function (camera) {
    return $http.get('http://localhost:8080/REST-API/detectedObject/peakHoursByDaysOfTheWeekAndCamera?cameraId=' + camera);
  };

  var detectedObjectsHistogramByMonthOfTheYear = function (camera) {
    return $http.get('http://localhost:8080/REST-API/detectedObject/detectedObjectsHistogramByMonthOfTheYear?cameraId=' + camera);
  };

  var detectedObjectsHistogramByDayOfTheWeek = function (camera) {
    return $http.get('http://localhost:8080/REST-API/detectedObject/detectedObjectsHistogramByDayOfTheWeek?cameraId=' + camera);
  };  

  var detectedObjectsHistogramByHour = function (camera,day) {
    return $http.get('http://localhost:8080/REST-API/detectedObject/detectedObjectsHistogramByHour?dayOfTheWeek=' + day + '&cameraId=' + camera);
  }; 

  var detectedObjectsAverageHistogramByHour = function (camera,day) {
    return $http.get('http://localhost:8080/REST-API/detectedObject/detectedObjectsAverageHistogramByHour?dayOfTheWeek=' + day + '&cameraId=' + camera);
  }; 

  var detectedObjectsAverageHistogramByDayOfTheWeek = function (camera) {
    return $http.get('http://localhost:8080/REST-API/detectedObject/detectedObjectsAverageHistogramByDayOfTheWeek?cameraId=' + camera);
  }; 

  var detectedObjectsAverageHistogramByMonthOfTheYear = function (camera) {
    return $http.get('http://localhost:8080/REST-API/detectedObject/detectedObjectsAverageHistogramByMonthOfTheYear?cameraId=' + camera);
  }; 

  return {
    peakHoursByDaysOfTheWeekAndCamera : peakHoursByDaysOfTheWeekAndCamera,
    detectedObjectsHistogramByMonthOfTheYear : detectedObjectsHistogramByMonthOfTheYear,
    detectedObjectsHistogramByDayOfTheWeek : detectedObjectsHistogramByDayOfTheWeek,
    detectedObjectsHistogramByHour : detectedObjectsHistogramByHour,
    detectedObjectsAverageHistogramByHour : detectedObjectsAverageHistogramByHour,
    detectedObjectsAverageHistogramByDayOfTheWeek : detectedObjectsAverageHistogramByDayOfTheWeek,
    detectedObjectsAverageHistogramByMonthOfTheYear : detectedObjectsAverageHistogramByMonthOfTheYear 
  }
}]);