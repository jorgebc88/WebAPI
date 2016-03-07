var app = angular.module('app.barChartCtrl',[]);

app.controller('barChartCtrl',['$scope','$http','$location', 'objectService', 'cameraService', '$filter', '$modal', function ($scope,$http,$location,objectService,cameraService, $filter, $modal) {
  $scope.Today = new Date();
  $scope.maxDate= new Date();
  $scope.fromTime = new Date();
  $scope.fromTime.setHours(0);
  $scope.fromTime.setMinutes(0);
  $scope.toTime = new Date();
  $scope.selectedTimeAsNumber = 10 * 36e5;
  $scope.selectedTimeAsString = '10:00';
  $scope.sharedDate = new Date(new Date().setMinutes(0));
  $scope.radioModel = 'Left';
  $scope.showHour=true;
  $scope.legend="";
  $scope.tabs=0;

  $scope.today = function() {
    $scope.dt = new Date();
    $scope.dt2 = new Date();
  };
  $scope.today();

  $scope.clear = function () {
    $scope.dt = null;
    $scope.dt2 = null;
  };

  $scope.toggleMin = function() {
    $scope.minDate = $scope.minDate ? null : new Date();
  };
  $scope.toggleMin();

  $scope.toggleMax = function() {
    $scope.maxDate  = new Date();
  };
  $scope.toggleMax();

  $scope.open = function($event) {
    $event.preventDefault();
    $event.stopPropagation();
    $scope.opened = true;
  };

  $scope.open2 = function($event) {
    $event.preventDefault();
    $event.stopPropagation();
    $scope.opened2 = true;
  };

  $scope.dateOptions = {
    formatYear: 'yy',
    startingDay: 1
  };
  $scope.formats = ['dd-MMMM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate'];
  $scope.format = $scope.formats[0];
  $scope.mytime = new Date();
  $scope.hstep = 1;
  $scope.mstep = 1;
  $scope.options = {
    hstep: [1, 2, 3],
    mstep: [1, 5, 10, 15, 25, 30]
  };
  $scope.ismeridian = true;

  $scope.toggleMode = function() {
    $scope.ismeridian = ! $scope.ismeridian;
  };

  $scope.update = function() {
    var d = new Date();
    d.setHours( 14 );
    d.setMinutes( 0 );
    $scope.mytime = d;
  };

  $scope.changed = function () {
    $log.log('Time changed to: ' + $scope.mytime);
  };

  $scope.clear = function() {
    $scope.mytime = null;
  };

  $scope.showCameraList = true;
  $scope.showToday = true;
  $scope.showDay = false;
  $scope.showRange = false;

  cameraService.cameraList().then(function(data){
    $scope.cameras = [];
    angular.forEach(data.data, function(data){
      $scope.cameras.push(data);
    });
    $scope.cameraSelected = $scope.cameras[0];
  }, function () {
    $modal({title: 'ERROR '+ status, content: 'Internal Server Error',  animation: 'am-fade-and-scale',
      placement: 'center'});
  });

  $scope.search = function () {
    if ($scope.showToday) {
      $scope.startDay = new Date($scope.Today);
      $scope.endDay = new Date($scope.Today);
    } 
    else if ($scope.showDay) {
      $scope.startDay = new Date($scope.selectedDate);
      $scope.endDay = new Date($scope.selectedDate);
    }
    else if ($scope.showRange) {
      $scope.startDay = new Date($scope.fromDate);
      $scope.endDay = new Date($scope.untilDate);
    }
    $scope.startDay.setHours($scope.fromTime.getHours());
    $scope.startDay.setMinutes($scope.fromTime.getMinutes());
    $scope.endDay.setHours($scope.toTime.getHours());
    $scope.endDay.setMinutes($scope.toTime.getMinutes());

    objectService.searchObjects($scope.startDay, $scope.endDay, $scope.cameraSelected.id).then(function (data) {
      $scope.draw($scope.tabs, data);
    }, function(){
      $scope.draw($scope.tabs, 0);
    });
  };

  objectService.detectedObject().then(function (data) {
    $scope.draw(0, data);
  });

  $scope.draw = function (tabs, data) {
    var $chart;
    $scope.$on("create", function (event, chart) {
      if (typeof $chart !== "undefined") {
        $chart.destroy();
      }
      $chart = chart;
    });
    $scope.tabs = tabs;
    if ($scope.tabs == 0) {
      $scope.legend = "All";
      $scope.colorUp = {
        fillColor: "rgba(51,3,0,0.2)",
        strokeColor: "rgba(51,3,0,1)",
        pointColor: "rgba(51,3,0,1)",
        pointStrokeColor: "#fff",
        pointHighlightFill: "#fff",
        pointHighlightStroke: "rgba(51,3,0,0.8)"
      };
      $scope.colorDown = {
        fillColor: "rgba(34,2,0,0.2)",
        strokeColor: "rgba(34,2,0,1)",
        pointColor: "rgba(34,2,0,1)",
        pointStrokeColor: "#fff",
        pointHighlightFill: "#fff",
        pointHighlightStroke: "rgba(34,2,0,0.8)"
      };
      $scope.objectType ="All";
    } else if ($scope.tabs == 1) {
      $scope.legend = "Bikes";
      $scope.colorUp = {
        fillColor: "rgba(221,77,51,0.2)",
        strokeColor: "rgba(221,77,51,1)",
        pointColor: "rgba(221,77,51,1)",
        pointStrokeColor: "#fff",
        pointHighlightFill: "#fff",
        pointHighlightStroke: "rgba(221,77,51,0.8)"
      };
      $scope.colorDown = {
        fillColor: "rgba(177,67,54,0.2)",
        strokeColor: "rgba(177,67,54,1)",
        pointColor: "rgba(177,67,54,1)",
        pointStrokeColor: "#fff",
        pointHighlightFill: "#fff",
        pointHighlightStroke: "rgba(177,67,54,0.8)"
      };
      $scope.objectType="Bike"; 
    } else if ($scope.tabs == 2) {
      $scope.legend = "Cars";
      $scope.colorUp = {
        fillColor: "rgba(0,166,90,0.2)",
        strokeColor: "rgba(0,166,90,1)",
        pointColor: "rgba(0,166,90,1)",
        pointStrokeColor: "#fff",
        pointHighlightFill: "#fff",
        pointHighlightStroke: "rgba(0,166,90,0.8)"
      };
      $scope.colorDown = {
        fillColor: "rgba(4,95,53,0.2)",
        strokeColor: "rgba(4,95,53,1)",
        pointColor: "rgba(4,95,53,1)",
        pointStrokeColor: "#fff",
        pointHighlightFill: "#fff",
        pointHighlightStroke: "rgba(4,95,53,0.8)"
      };
      $scope.objectType="Car"; 
    } else if ($scope.tabs == 3) {
      $scope.legend = "Buses/Trucks";
      $scope.colorUp = {
        fillColor: "rgba(243,156,18,0.2)",
        strokeColor: "rgba(243,156,18,1)",
        pointColor: "rgba(243,156,18,1)",
        pointStrokeColor: "#fff",
        pointHighlightFill: "#fff",
        pointHighlightStroke: "rgba(243,156,18,0.8)"
      };
      $scope.colorDown = {
        fillColor: "rgba(198,127,15,0.2)",
        strokeColor: "rgba(198,127,15,1)",
        pointColor: "rgba(198,127,15,1)",
        pointStrokeColor: "#fff",
        pointHighlightFill: "#fff",
        pointHighlightStroke: "rgba(198,127,15,0.8)"
      };
      $scope.objectType="Bus"; 
    }

    $scope.sundayUp = [];
    $scope.mondayUp = [];
    $scope.tuesdayUp = [];
    $scope.wednesdayUp = [];
    $scope.thursdayUp = [];
    $scope.fridayUp =[];
    $scope.saturdayUp = [];
    $scope.data = [];

    if(angular.isDefined(data)){
      $scope.values = data.data;
    }

    angular.forEach($scope.values, function (value, key) {
      if (value.objectType == $scope.objectType || $scope.objectType == 'All') {
        var date = new Date(value.date);
        if(date.getDay() == 0) {
          $scope.sundayUp.push(value);
        }
        else if(date.getDay() == 1) {
          $scope.mondayUp.push(value);
        }
        else if(date.getDay() == 2) {
          $scope.tuesdayUp.push(value);
        }
        else if(date.getDay() == 3) {
          $scope.wednesdayUp.push(value);
        }
        else if(date.getDay() == 4) {
          $scope.thursdayUp.push(value);
        }
        else if(date.getDay() == 5) {
          $scope.fridayUp.push(value);
        }
        else if(date.getDay() == 6) {
          $scope.saturdayUp.push(value);
        }
      }
    });

    $scope.labels = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    $scope.series = [$scope.legend + '-North'];
    $scope.data = [
    [$scope.sundayUp.length, $scope.mondayUp.length, $scope.tuesdayUp.length, $scope.wednesdayUp.length, $scope.thursdayUp.length, $scope.fridayUp.length, $scope.saturdayUp.length]
    ];
    $scope.colours = [$scope.colorUp, $scope.colorDown];
  }
}]);
