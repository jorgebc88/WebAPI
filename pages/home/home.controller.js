var app = angular.module('app.homeCtrl',[]);

app.controller('homeCtrl',['$scope', '$document', '$http', '$location','adminService', '$modal', function ($scope, $document, $http, $location, adminService, $modal) {
  $scope.bike =0;
  $scope.car =0;
  $scope.bus =0;

  adminService.cameraList().then(function(data){
    $scope.cameras = [];
    angular.forEach(data.data, function(data){
      if (data.active == true) {
        $scope.cameras.push(data);
      }
    });
    $scope.cameraSelected = $scope.cameras[0];
    $scope.port = $scope.cameraSelected.id + 8090;
    $scope.video($scope.cameraSelected.id);
  }, function () {
    $modal({title: 'ERROR '+ status, content: 'Internal Server Error',  animation: 'am-fade-and-scale',
      placement: 'center'});
  });
  
  $scope.video = function (id) {
    $scope.sse = $.SSE('http://192.168.2.120:8080/REST-API/detectedObject/serverSentEvents?cameraId=' + id, {
      onOpen: function(e){  
      },
      onEnd: function(e){ 
      },
      onError: function(e){ 
        console.log("Could not connect"); 
      },
      onMessage: function(e){
        $scope.objectDetected = angular.fromJson(e.data);
        $scope.bike = $scope.objectDetected.detectedObject[0].bike;
        $scope.car = $scope.objectDetected.detectedObject[0].car;
        $scope.bus = $scope.objectDetected.detectedObject[0].bus;
        if ($location.path() != "/home"){
          $scope.sse.stop();
        }
        $scope.$apply(function () {
          if($scope.cameraSelected.id != id) {
            $scope.sse.stop();
            $scope.port = $scope.cameraSelected.id + 8090;
            $scope.video($scope.cameraSelected.id);
          }
        });
      }    
    });
    $scope.sse.start();
  };

  $scope.parts = [
  {name: "Presentation", link: "presentation"},
  {name: "Video", link: "video"},
  {name: "References", link: "info"}
  ];
}]).value('duScrollOffset', 30);
