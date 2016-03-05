var app = angular.module('app.services',[]);

app.service('userConService',['$cookieStore', function ($cookieStore){
  this.userCon = function(){
    return { 
      user : $cookieStore.get('user'),
      connected : $cookieStore.get('connected'),
      level : $cookieStore.get('level')
    };
  }
}]);

app.service('userRememberService', ['$cookieStore', function ($cookieStore){
  this.userRem = function(){
    return { 
      rememberName : $cookieStore.get('rememberName'),
      rememberPass : $cookieStore.get('rememberPass'),
      check : $cookieStore.get('check')
    };
  }
}]);

app.service('objectService', ['$http', function ($http){
  var detectedObject = function () {
    return $http.get('http://192.168.2.120:8080/REST-API/detectedObject/requestDetectedObject');
  };

  var searchObjects = function(startDate, endDate, id) {
    return $http.get('http://192.168.2.120:8080/REST-API/detectedObject/requestDetectedObjectByDatesBetweenAndCameraId?startDate=' + startDate + '&endDate=' + endDate + '&cameraId=' + id);
  };

  return {
    detectedObject : detectedObject,
    searchObjects : searchObjects
  }

}]);

app.service('cameraService', ['$http', function ($http){
  var cameraList = function () {
    return $http.get('http://192.168.2.120:8080/REST-API/camera/list');
  };

  return {
    cameraList : cameraList
  }

}]);


app.service('adminService', ['$http', function ($http){
  var userList = function () {
    return $http.get('http://192.168.2.120:8080/REST-API/user/list');
  };

  var deleteUser = function (id) {
    return $http.get('http://192.168.2.120:8080/REST-API/user/delete/' + id);
  };

  var addUser = function (userName, password, level){
    return $http.post('http://192.168.2.120:8080/REST-API/user/newUser', {"userName": userName, "password": password, "level": level});
  };

  var cameraList = function () {
    return $http.get('http://192.168.2.120:8080/REST-API/camera/list');
  };

  var activeCamera = function (id, active) {
    return $http.get('http://192.168.2.120:8080/REST-API/camera/modifyCamera?id='+ id + '&active=' + active);
  };

  var addCamera = function (location, latitude, longitude, ip, active){
    return $http.post('http://192.168.2.120:8080/REST-API/camera/newCamera', {"location": location, "latitude": latitude, "longitude": longitude, "ip": ip, "active": active});
  };

  return {
    userList : userList,
    deleteUser : deleteUser,
    addUser : addUser,
    cameraList : cameraList,
    activeCamera : activeCamera,
    addCamera: addCamera,
  }

}]);

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

app.service('trafficFlowService', ['$http', function ($http){
  var peakHoursByDaysOfTheWeekAndCamera = function (camera) {
    return $http.get('http://192.168.2.120:8080/REST-API/detectedObject/peakHoursByDaysOfTheWeekAndCamera?cameraId=' + camera);
  };

  var detectedObjectsHistogramByMonthOfTheYear = function (camera) {
    return $http.get('http://192.168.2.120:8080/REST-API/detectedObject/detectedObjectsHistogramByMonthOfTheYear?cameraId=' + camera);
  };

  var detectedObjectsHistogramByDayOfTheWeek = function (camera) {
    return $http.get('http://192.168.2.120:8080/REST-API/detectedObject/detectedObjectsHistogramByDayOfTheWeek?cameraId=' + camera);
  };  

  var detectedObjectsHistogramByHour = function (camera,day) {
    return $http.get('http://192.168.2.120:8080/REST-API/detectedObject/detectedObjectsHistogramByHour?dayOfTheWeek=' + day + '&cameraId=' + camera);
  }; 

  var detectedObjectsAverageHistogramByHour = function (camera,day) {
    return $http.get('http://192.168.2.120:8080/REST-API/detectedObject/detectedObjectsAverageHistogramByHour?dayOfTheWeek=' + day + '&cameraId=' + camera);
  }; 

  var detectedObjectsAverageHistogramByDayOfTheWeek = function (camera) {
    return $http.get('http://192.168.2.120:8080/REST-API/detectedObject/detectedObjectsAverageHistogramByDayOfTheWeek?cameraId=' + camera);
  }; 

  var detectedObjectsAverageHistogramByMonthOfTheYear = function (camera) {
    return $http.get('http://192.168.2.120:8080/REST-API/detectedObject/detectedObjectsAverageHistogramByMonthOfTheYear?cameraId=' + camera);
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