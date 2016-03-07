var app = angular.module('app.trafficFlowCtrl',[]);

app.controller('trafficFlowCtrl',['$scope','$http','trafficFlowService','adminService', '$modal', '$timeout', 'ChartJs', function ($scope,$http,trafficFlowService,adminService,$modal,$timeout,ChartJs){
  $scope.tabsHorizontal = 0;
  $scope.days = [{id: 1, day:"Sunday"}, {id: 2, day:"Monday"}, {id: 3, day:"Tuesday"}, {id: 4, day:"Wednesday"}, {id: 5, day:"Thursday"}, {id: 6, day:"Friday"}, {id: 7, day:"Saturday"}];
  $scope.auxCamera = 0;
  $scope.auxDay = 0;
  $scope.peakHourOptions = {
    scaleOverride: true,
    scaleSteps: 23,
    scaleStepWidth: 1,
    scaleLabel: "<%=value%>:00 hs"
  }

  adminService.cameraList().then(function(data){
    $scope.cameras = [];
    angular.forEach(data.data, function(data){
      $scope.cameras.push(data);
    });
    $scope.selected = $scope.cameras[0];
    $scope.selectedDay = $scope.days[0];
    $scope.drawByHours($scope.selected.id,1);
    $scope.drawByPeakHours($scope.selected.id);
    $scope.drawByDays($scope.selected.id);
    $scope.drawByMonths($scope.selected.id);
  }, function () {
    $modal({title: 'ERROR '+ status, content: 'Internal Server Error',  animation: 'am-fade-and-scale',
      placement: 'center'});
  });

  $scope.drawByPeakHours = function (camera) {
    $scope.peakHourLabels = [];
    $scope.peakHourSeries = [];
    $scope.peakHourData = []; 
    $scope.dataAux = []; 
    for(var i = 0; i < 7; i++){
      $scope.dataAux.push(0);
    }      
    trafficFlowService.peakHoursByDaysOfTheWeekAndCamera(camera).then(function(data){
      angular.forEach(data.data, function(data){
        var position = data[0] - 1;
        $scope.dataAux.splice(position,1,data[1]);
      });
      clearChart("chartByPeakHour");
      $scope.peakHourLabels = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
      $scope.peakHourSeries = ['Peak hour'];
      $scope.peakHourData = [$scope.dataAux];   
    }, function () {
      $modal({title: 'ERROR '+ status, content: 'Internal Server Error',  animation: 'am-fade-and-scale',
        placement: 'center'});
    });
  };

  $scope.drawByHours = function (camera, day) {
    if (camera != 0) {
      $scope.auxCamera = camera;
    }
    if (day != 0) {
      $scope.auxDay = day;
    }
    $scope.hourLabels = [];
    $scope.hourSeries = [];
    $scope.hourData = []; 
    $scope.dataAux4 = []; 

    for(var i = 0; i < 24; i++){
      $scope.hourLabels.push(i+":00 hs");
      $scope.dataAux4.push(0);
    }  

    trafficFlowService.detectedObjectsHistogramByHour($scope.auxCamera, $scope.auxDay).then(function(data){
      angular.forEach(data.data, function(data){
        var position = data[0] - 1;
        $scope.dataAux4.splice(position,1,data[1]);
      });
      clearChart("chartByHour");
      $scope.hourSeries = ['Object detected'];
      $scope.hourData = [$scope.dataAux4];   
    }, function () {
      $modal({title: 'ERROR '+ status, content: 'Internal Server Error',  animation: 'am-fade-and-scale',
        placement: 'center'});
    });

    $scope.drawAverageByHours(camera, day);
  };

  $scope.drawAverageByHours = function (camera, day) {
    if (camera != 0) {
      $scope.auxCamera = camera;
    }
    if (day != 0) {
      $scope.auxDay = day;
    }

    $scope.averageHourLabels = [];
    $scope.averageHourSeries = [];
    $scope.averageHourData = []; 
    $scope.dataAux5 = [];
    for(var i = 0; i < 24; i++){
      $scope.averageHourLabels.push(i+":00 hs");
      $scope.dataAux5.push(0);
    }  

    trafficFlowService.detectedObjectsAverageHistogramByHour($scope.auxCamera, $scope.auxDay).then(function(data){
      angular.forEach(data.data, function(data){
        var position = data[0] - 1;
        $scope.dataAux5.splice(position,1,data[1]);
      });
      clearChart("chartAverageByHour");
      $scope.averageHourSeries = ['Object detected'];
      $scope.averageHourData = [$scope.dataAux5];   
    }, function () {
      $modal({title: 'ERROR '+ status, content: 'Internal Server Error',  animation: 'am-fade-and-scale',
        placement: 'center'});
    });
  };

  $scope.drawByDays = function (camera) {
    $scope.dayLabels = [];
    $scope.daySeries = [];
    $scope.dayData = []; 
    $scope.dataAux2 = [];

    for(var i = 0; i < 12; i++){
      $scope.dataAux2.push(0);
    }     

    trafficFlowService.detectedObjectsHistogramByDayOfTheWeek(camera).then(function(data){
      var i = 1;
      angular.forEach(data.data, function(data){
        var position = data[0] - 1;
        $scope.dataAux2.splice(position,1,data[1]);
      });  
      clearChart("chartByDay");
      $scope.dayLabels = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
      $scope.daySeries = ['Object detected'];
      $scope.dayData = [$scope.dataAux2];
    }, function () {
      $modal({title: 'ERROR '+ status, content: 'Internal Server Error',  animation: 'am-fade-and-scale',
        placement: 'center'});
    });

    $scope.drawAverageByDays(camera);
  };

  $scope.drawAverageByDays = function (camera) {
    $scope.averageDayLabels = [];
    $scope.averageDaySeries = [];
    $scope.averageDayData = []; 
    $scope.dataAux6 = [];

    for(var i = 0; i < 12; i++){
      $scope.dataAux6.push(0);
    }     

    trafficFlowService.detectedObjectsAverageHistogramByDayOfTheWeek(camera).then(function(data){
      var i = 1;
      angular.forEach(data.data, function(data){
        var position = data[0] - 1;
        $scope.dataAux6.splice(position,1,data[1]);
      }); 
      clearChart("chartAverageByDay");
      $scope.averageDayLabels = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
      $scope.averageDaySeries = ['Object detected'];
      $scope.averageDayData = [$scope.dataAux6];
    }, function () {
      $modal({title: 'ERROR '+ status, content: 'Internal Server Error',  animation: 'am-fade-and-scale',
        placement: 'center'});
    });
  };

  $scope.drawByMonths = function (camera) {
    $scope.monthLabels = [];
    $scope.monthSeries = [];
    $scope.monthData = []; 
    $scope.dataAux3 = [];

    for(var i = 0; i < 12; i++){
      $scope.dataAux3.push(0);
    }     

    trafficFlowService.detectedObjectsHistogramByMonthOfTheYear(camera).then(function(data){
      var i = 1;
      angular.forEach(data.data, function(data){
        var position = data[0] - 1;
        $scope.dataAux3.splice(position,1,data[1]);
      });
      clearChart("chartByMonth");
      $scope.monthLabels = ["January","February","March","April","May","June","July","August","September","October","November","December"];
      $scope.monthSeries = ['Object detected'];
      $scope.monthData = [$scope.dataAux3];
    }, function () {
      $modal({title: 'ERROR '+ status, content: 'Internal Server Error',  animation: 'am-fade-and-scale',
        placement: 'center'});
    });

    $scope.drawAverageByMonths(camera);
  };

  $scope.drawAverageByMonths = function (camera) {
    $scope.averageMonthLabels = [];
    $scope.averageMonthSeries = [];
    $scope.averageMonthData = []; 
    $scope.dataAux7 = [];

    for(var i = 0; i < 12; i++){
      $scope.dataAux7.push(0);
    }     

    trafficFlowService.detectedObjectsAverageHistogramByMonthOfTheYear(camera).then(function(data){
      var i = 1;
      angular.forEach(data.data, function(data){
        var position = data[0] - 1;
        $scope.dataAux7.splice(position,1,data[1]);
      });
      clearChart("chartAverageByMonth");
      $scope.averageMonthLabels = ["January","February","March","April","May","June","July","August","September","October","November","December"];
      $scope.averageMonthSeries = ['Object detected'];
      $scope.averageMonthData = [$scope.dataAux7];
    }, function () {
      $modal({title: 'ERROR '+ status, content: 'Internal Server Error',  animation: 'am-fade-and-scale',
        placement: 'center'});
    });
  };

  function clearChart(elementId) {
    if (document.getElementById(elementId)) {
      var charts = ChartJs.Chart.instances;
      for (var key in charts){ 
        if (!charts.hasOwnProperty(key)){
          continue;
        }
        var chartAux = ChartJs.Chart.instances[key]; 
        if (chartAux.chart.ctx.canvas.id === elementId){ 
          var parent = chartAux.chart.ctx.canvas.parentElement;
          var legend = chartAux.chart.ctx.canvas.nextElementSibling;
          ChartJs.Chart.instances[key].destroy(); 
        }
      }
    }
  }
}]);