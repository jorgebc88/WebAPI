var app = angular.module('app.adminCtrl',[]);

app.controller('adminCtrl',[ '$scope', 'adminService', '$modal', '$alert', 'DTOptionsBuilder', 'DTDefaultOptions', 'DTColumnDefBuilder', function ($scope, adminService, $modal, $alert, DTOptionsBuilder, DTDefaultOptions, DTColumnDefBuilder) {
  $scope.isCollapsedAdd = false;
  $scope.dtOptions = DTOptionsBuilder.newOptions()
  .withSelect({
    style: 'multi',
    selector: 'td',
    info: false
  })
  .withOption('order', [[1, 'asc']])
  .withOption('searching', false)
  .withOption('paging', false)
  .withButtons([{
    text: '<span class="glyphicon glyphicon-trash"></span> Delete Users',
    className :'btn btn-danger',
    action: function ( e, dt ) {
      $scope.values = dt.rows({ selected: true }).data();
      var count = dt.rows( { selected: true } ).indexes().length;
      if(count > 0) {
        $scope.removeUser($scope.values);
      } else {
        $modal({title: 'Can not perform action, please select one element',  animation: 'am-fade-and-scale',
          placement: 'center'});
      }
    }
  }]);

  $scope.dtOptions2 = DTOptionsBuilder.newOptions()
  .withSelect({
    style: 'multi',
    selector: 'td',
    info: false
  })
  .withOption('order', [[1, 'asc']])
  .withOption('searching', false)
  .withOption('paging', false)
  .withButtons([{
    text: '<span class="glyphicon glyphicon-facetime-video"></span> Enable/Disable Cameras',
    className :'btn btn-success',
    action: function ( e, dt ) {
      $scope.values = dt.rows({ selected: true }).data();
      var count = dt.rows( { selected: true } ).indexes().length;
      if(count > 0) {
        $scope.modifyCameras($scope.values);
      } else {
        $modal({title: 'Can not perform action, please select one element', animation: 'am-fade-and-scale',
          placement: 'center'});
      }
    }
  }]);

  $scope.dtColumnDefs = [
  DTColumnDefBuilder.newColumnDef(0)
  .notSortable()
  .withClass('select-checkbox')
  .renderWith(function() {return '';})
  ];

  $scope.userList = function () {
    adminService.userList().then(function (data){
      $scope.Users = data.data;
    }, function () {
      $modal({title: 'ERROR '+ status, content: 'Internal Server Error',  animation: 'am-fade-and-scale',
        placement: 'center'});
    });
  };

  $scope.userList();

  $scope.removeUser = function(data){ 
    var myOtherModal = $modal({title : 'Are you sure you want to delete the selection?',scope: $scope, template: 'pages/modalAdmin.html', show: false});
    myOtherModal.$promise.then(myOtherModal.show);
    $scope.delete = function() {
      var counter = 0;
      var length = data.length;
      myOtherModal.$promise.then(myOtherModal.hide);
      angular.forEach(data, function(data, key) {
        var id = data[1];
        adminService.deleteUser(id).then(function (data){
          counter++;
          if (counter == length) {
            $alert({title: 'Selection deleted successfully!', placement: 'top', type: 'info', show: true, duration: 2}); 
            $scope.userList();
          } 
        }, function (data) {
          alert("An error ocurred in the database. Please try again.");
        });
      });
    };
  };

  $scope.level = "1";

  $scope.formUserAllGood = function () {
    if($scope.usernameGood && $scope.passwordGood && $scope.passwordCGood){
      adminService.addUser($scope.userForm.username.$viewValue,$scope.userForm.password.$viewValue, $scope.userForm.level.$viewValue).then(function (response){
        $alert({title: 'New user added successfully!', placement: 'top', type: 'info', show: true, duration: 2});
        $scope.userList();
      }, function (response) {
        alert("An error ocurred in the database. Please try again.");
      });
    }
    else{
      alert("Please complete all fields.");
      return;
    }
    $scope.username='';
    $scope.password='';
    $scope.password_c='';
    $scope.userForm.$setPristine();
    return ($scope.usernameGood && $scope.passwordGood && $scope.passwordCGood)
  };

  $scope.cameraList = function () {
    adminService.cameraList().then(function (data) {
      $scope.Cameras = data.data;
    });
  };

  $scope.cameraList();

  $scope.modifyCameras = function(data){ 
    var counter = 0;
    var length = data.length;

    angular.forEach(data, function(data, key) {
      var id = data[1];
      var active;
      if (data[2] == 'true')
        active = 0;
      else
        active = 1;
      adminService.activeCamera(id, active).then(function (data){
        counter++;
        if (counter == length) {
          $alert({title: 'Cameras have successfully changed their state!', placement: 'top', type: 'info', show: true, duration: 2}); 
          $scope.cameraList();
        } 
      }, function (data) {
        alert("An error ocurred in the database. Please try again.");
      });
    });
  };

  $scope.activeCamera = "1";
  $scope.pointingAt = "North";

  $scope.formCameraAllGood = function () {
    console.log(parseInt($scope.myform.activeCamera.$viewValue));
    if($scope.locationGood && $scope.latitudeGood && $scope.longitudeGood && $scope.ipGood){
      adminService.addCamera($scope.myform.location.$viewValue,$scope.myform.latitude.$viewValue, $scope.myform.longitude.$viewValue, $scope.myform.ip.$viewValue, $scope.myform.pointingAt.$viewValue, parseInt($scope.myform.activeCamera.$viewValue)).then(function (response){
        $alert({title: 'New camera added successfully!', placement: 'top', type: 'info', show: true, duration: 2});
        $scope.cameraList();
      }, function (response) {
        alert("An error ocurred in the database. Please try again.");
      });
    }
    else{
      alert("Please complete all fields.");
      return;
    }
    $scope.location='';
    $scope.latitude='';
    $scope.longitude='';
    $scope.ip='';
    $scope.pointingAt='';
    $scope.myform.$setPristine();
    return ($scope.locationGood && $scope.latitudeGood && $scope.longitudeGood && $scope.ipGood)
  };
}]);