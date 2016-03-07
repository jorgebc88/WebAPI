var app = angular.module('app.rankingService',[]);

app.service('rankingService', ['$http', function ($http){
  var rankingHistorical = function () {
    return $http.get('http://192.168.2.120:8080/REST-API/detectedObject/allTimeRanking');
  };

  var rankingByYear = function (year) {
    return $http.get('http://192.168.2.120:8080/REST-API/detectedObject/rankingByYear?year=' + year);
  };

  var rankingByMonth = function (month, year) {
    return $http.get('http://192.168.2.120:8080/REST-API/detectedObject/rankingByYearAndMonth?year=' + year + '&month=' + month);
  };

  var rankingByDates = function (startDate, endDate) {
    return $http.get('http://192.168.2.120:8080/REST-API/detectedObject/rankingBetweenDates?startDate=' + startDate + '&endDate='  + endDate);
  };

  return {
    rankingHistorical : rankingHistorical,
    rankingByYear : rankingByYear,
    rankingByMonth : rankingByMonth,
    rankingByDates : rankingByDates
  }
}]);