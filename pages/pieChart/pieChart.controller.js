var app = angular.module('app.pieChartCtrl',[]);

app.controller("pieChartCtrl",['$scope','$http','$location', 'cameraService', '$modal', function ($scope,$http,$location,cameraService, $modal) {
  $scope.bike = 0;
  $scope.car = 0;
  $scope.bus = 0;
  $scope.labels = ["Bikes", "Cars", "Buses/Trucks"];
  $scope.data = [$scope.bike, $scope.car, $scope.bus];
  $scope.colours = [
  {
    fillColor: "rgba(221,75,57,0.2)",
    strokeColor: "rgba(221,75,57,1)",
    pointColor: "rgba(221,75,57,1)",
    pointStrokeColor: "#fff",
    pointHighlightFill: "#fff",
    pointHighlightStroke: "rgba(221,75,57,0.8)"
  }, 
  {
    fillColor: "rgba(0,166,90,0.2)",
    strokeColor: "rgba(0,166,90,1)",
    pointColor: "rgba(0,166,90,1)",
    pointStrokeColor: "#fff",
    pointHighlightFill: "#fff",
    pointHighlightStroke: "rgba(0,166,90,0.8)"
  },
  {
    fillColor: "rgba(243,156,18,0.2)",
    strokeColor: "rgba(243,156,18,1)",
    pointColor: "rgba(243,156,18,1)",
    pointStrokeColor: "#fff",
    pointHighlightFill: "#fff",
    pointHighlightStroke: "rgba(243,156,18,0.8)"
  }];

  cameraService.cameraList().then(function(data){
    $scope.cameras = [];
    angular.forEach(data.data, function(data){
      if (data.active == true) {
        $scope.cameras.push(data);
      }
    });
    $scope.cameraSelected = $scope.cameras[0];
    $scope.refresh($scope.cameraSelected.id);
  }, function () {
    $modal({title: 'ERROR '+ status, content: 'Internal Server Error',  animation: 'am-fade-and-scale',
      placement: 'center'});
  });

  $scope.objectDetected = [];
  $scope.options = {
    responsive : false,
  };

  $scope.refresh = function (id) {
    $scope.sse = $.SSE('http://192.168.2.120:8080/REST-API/detectedObject/serverSentEvents?cameraId=' + id, {
      onOpen: function (e) {
      },
      onEnd: function (e) {
      },
      onError: function (e) {
        console.log("Could not connect");
      },
      onMessage: function (e) {
        $scope.objectDetected = angular.fromJson(e.data);
        $scope.bike = $scope.objectDetected.detectedObject[0].bike;
        $scope.car = $scope.objectDetected.detectedObject[0].car;
        $scope.bus = $scope.objectDetected.detectedObject[0].bus;
        if ($location.path() != "/statistics") {
          $scope.sse.stop();
        }
        $scope.$apply(function () {
          $scope.labels = ["Bikes", "Cars", "Buses/Trucks"];
          $scope.data = [$scope.bike, $scope.car, $scope.bus];
          if($scope.cameraSelected.id != id) {
            $scope.sse.stop();
            $scope.refresh($scope.cameraSelected.id);
          }
        });
      }
    });
    $scope.sse.start();
  }
}]);
