var app = angular.module('app.rankingCtrl',[]);

app.controller('rankingCtrl',['$scope','$http', 'rankingService', 'adminService', '$modal', function ($scope,$http,rankingService,adminService, $modal) { 
  $scope.maxDate = new Date();
  $scope.minDate = new Date('2000');
  $scope.startDate = new Date('2000');
  $scope.aux = new Date();
  $scope.selectedDate = new Date();
  $scope.selectedDate2 = new Date();
  $scope.year = $scope.aux.getFullYear();
  $scope.yearByM = $scope.aux.getFullYear();
  $scope.monthByM = $scope.aux.getMonth() + 1;
  $scope.fromDate = new Date();
  $scope.fromDate.setYear(2010);
  $scope.untilDate = new Date();
  $scope.tabsHorizontal = 0;

  adminService.cameraList().then(function(data){
    $scope.cameras = data.data;
    $scope.drawHistorical();
    $scope.drawByYear($scope.year);
    $scope.drawByMonth($scope.monthByM, $scope.yearByM);
    $scope.drawByDates($scope.fromDate, $scope.untilDate);
  }, function () {
    $modal({title: 'ERROR '+ status, content: 'Internal Server Error',  animation: 'am-fade-and-scale',
      placement: 'center'});
  });

  $scope.drawHistorical = function () {
    rankingService.rankingHistorical().then(function (data) {
      $scope.drawHorizontalBar(data.data, 0);
    }, function () {
      $modal({title: 'ERROR '+ status, content: 'Internal Server Error',  animation: 'am-fade-and-scale',
        placement: 'center'});
    });
  };

  $scope.drawByYear = function (year) {
    rankingService.rankingByYear(year).then(function (data) {
      $scope.drawHorizontalBar(data.data, 1);
    }, function () {
      $modal({title: 'ERROR '+ status, content: 'Internal Server Error',  animation: 'am-fade-and-scale',
        placement: 'center'});
    });
  };

  $scope.drawByMonth = function (month, year) {
    rankingService.rankingByMonth(month, year).then(function (data) {
      $scope.drawHorizontalBar(data.data, 2);
    }, function () {
      $modal({title: 'ERROR '+ status, content: 'Internal Server Error',  animation: 'am-fade-and-scale',
        placement: 'center'});
    });
  };

  $scope.drawByDates = function (startDay, endDay) {
    rankingService.rankingByDates(startDay, endDay).then(function (data) {
      $scope.drawHorizontalBar(data.data, 3);
    }, function () {
      $modal({title: 'ERROR '+ status, content: 'Internal Server Error',  animation: 'am-fade-and-scale',
        placement: 'center'});
    });
  };

  $scope.drawHorizontalBar = function(data, activeTab) {
    $scope.labels = [];
    var dataChart = [];
    var labels = [];
    var amount = [];
    var counter = 0;
    var flag = 0;

    angular.forEach($scope.cameras, function(camera){
      angular.forEach(data, function(data){
        counter++;
        if(camera.id == data[0]){
          dataChart.push({"location": camera.location, "amount":data[1]});
          flag = 1;
        }
      })
      if (flag == 0) {
        dataChart.push({"location": camera.location, "amount":0})
      } else {
        flag = 0;
      }
    });

    dataChart.sort(function(a, b) {
      return parseFloat(a.amount) - parseFloat(b.amount);
    });

    for (var i = dataChart.length; i < 5; i++) {
      dataChart.splice(-10,0,{"location": "No camera", "amount":0});
    };

    angular.forEach(dataChart, function(dataChart){
      labels.push(dataChart.location);
      amount.push(dataChart.amount);
    });

    $scope.labels = labels;
    $scope.type = "HorizontalBar";

    if (activeTab == 0) {
      $scope.data1 = [];
      $scope.data1 = [amount];
    } else if(activeTab == 1) {
      $scope.data2 = [];
      $scope.data2 = [amount];
    } else if(activeTab == 2) {
      $scope.data3 = [];
      $scope.data3  = [amount];
    } else if(activeTab == 3) {
      $scope.data4 = [];
      $scope.data4  = [amount];
    }
  };

  $scope.openByYear = function(selectedDate) {
    $scope.year = selectedDate.getFullYear();
    $scope.drawByYear($scope.year);
  }

  $scope.openByMonth = function(selectedDate) {
    $scope.yearByM = selectedDate.getFullYear();
    $scope.monthByM = selectedDate.getMonth() + 1;
    $scope.drawByMonth($scope.monthByM, $scope.yearByM);
  }

  $scope.changeFromDate = function(selectedDate) {
    $scope.fromDate = selectedDate;
    $scope.drawByDates($scope.fromDate, $scope.untilDate);
  }

  $scope.changeUntilDate = function(selectedDate) {
    $scope.untilDate = selectedDate;
    $scope.drawByDates($scope.fromDate, $scope.untilDate);
  }
}]);