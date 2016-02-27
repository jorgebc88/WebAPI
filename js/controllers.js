var app = angular.module('app.controllers',['ngRoute','ngResource','ngCookies','ngSanitize','ngAnimate', 'chart.js','duScroll','mgcrea.ngStrap','mgcrea.ngStrap.helpers.parseOptions', 'datatables', 'datatables.select', 'datatables.buttons', 'datatables.bootstrap']);

app.controller('indexCtrl',['$scope','$cookieStore','$location','userConService','$http', '$modal', '$aside', function ($scope,$cookieStore,$location,userConService,$http,$modal,$aside){  
var myOtherAside = $aside({scope: $scope, show: false, template: 'pages/menu.html', animation: "am-fade-and-slide-left", placement: "left"});
// Show when some event occurs (use $promise property to ensure the template has been loaded)
$scope.showAside = function () {
  myOtherAside.$promise.then(myOtherAside.show());
};
$scope.closeAside = function () {
  myOtherAside.$promise.then(myOtherAside.hide());
};
$scope.LoggedUser = [
{text: ' <span class="glyphicon glyphicon-log-out"></span> Close session', click: 'showModal()', show: true}
];
$scope.dropdown = [
{text: 'Pie chart stats', href: '#/statistics#statistics'},
{text: 'Bar stats', href: '#/stats#statistics'},
{text: 'Rankings', href: '#/ranking#statistics'},
];
$scope.isActive = function (viewLocation) { 
  return viewLocation === $location.path();
};
$scope.userCon = userConService.userCon();
$scope.userConnected = {'name': "", 'level': "", 'connected':""};
if($scope.userCon.connected == true){
  $scope.userConnected.name = $scope.userCon.user.userName;
  $scope.userConnected.level = 1;
  $scope.userConnected.connected = true;
};
var myOtherModal = $modal({title : '¿Está seguro que desea cerrar sesión?',scope: $scope, template: 'pages/modal.html', show: false});
// Show when some event occurs (use $promise property to ensure the template has been loaded)
$scope.showModal = function() {
  myOtherAside.$promise.then(myOtherAside.hide());
  myOtherModal.$promise.then(myOtherModal.show);
};
$scope.logout = function(){
$http.get('http://localhost:8080/REST-API/user/logout');//http://192.168.2.108:8080
$scope.userConnected = {'name': "", 'level': "", 'connected':""};
$cookieStore.remove('connected');
$cookieStore.remove('level');
$cookieStore.remove('user');
$location.path('/');
myOtherModal.$promise.then(myOtherModal.hide);
};
}]);

app.controller('loginCtrl',['$scope','$http','$q','$log','$cookieStore','$location','userRememberService','$modal', function ($scope,$http,$q,$log,$cookieStore,$location,userRememberService,$modal){ 
  var session = $q.defer();
  session.promise.then(userSession);
  $scope.userRem = userRememberService.userRem();
  if($scope.userRem.check == true){
    $scope.userName = $scope.userRem.rememberName;
    $scope.password = $scope.userRem.rememberPass;
    $scope.checkboxModel = $scope.userRem.check;
  }
  $scope.loginControl = function(){
    if($scope.userName != null && $scope.password != null){
      $scope.login();
    }   else{
      $modal({title: 'ERROR!', content: 'Please complete the fields',  animation: 'am-fade-and-scale',
        placement: 'center'});
    }
  };
  $scope.login = function (){
    var userName = $scope.userName;
    var password = $scope.password;
    var usr = $http.post('http://localhost:8080/REST-API/user/login', {"userName": userName, "password": password})
    .then(function(response) {
      session.resolve(response.data);
    },function(response) {
      $modal({title: 'ERROR '+ status, content: 'User or Password invalid',  animation: 'am-fade-and-scale',
        placement: 'center'});
    });
  };
  function userSession(usr){
    $scope.userConnected.name = usr.userName;
    $scope.userConnected.level = 1;
    $scope.userConnected.connected = true;
    $log.info($scope.userConnected);
    $cookieStore.put('connected', true);
    $cookieStore.put('user', usr);
    $cookieStore.put('level', 1);
    $location.path('/home');
    $scope.addCookieSession(usr);
  }; 
  $scope.addCookieSession = function(data){
    var name = data.userName;
    var pass = data.password;
    var check = $scope.checkboxModel
    if($scope.checkboxModel){

      $cookieStore.put('rememberName', name);
      $cookieStore.put('rememberPass', pass);
      $cookieStore.put('check', check);  
    }
    else
    {
      $cookieStore.remove('rememberName');
      $cookieStore.remove('rememberPass');
      $cookieStore.remove('check', check); 
    }
  };
}]);

app.controller('homeCtrl',['$scope', '$document', '$http', '$location','adminService', function ($scope, $document, $http, $location, adminService) {
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
});
  $scope.video = function (id) {
    $scope.sse = $.SSE('http://localhost:8080/REST-API/detectedObject/serverSentEvents?cameraId=' + id, {
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

app.controller("pieChartCtrl",['$scope','$http','$location', function ($scope,$http,$location) { 
  $scope.colours = [
    { // red
        fillColor: "rgba(221,75,57,0.2)",
        strokeColor: "rgba(221,75,57,1)",
        pointColor: "rgba(221,75,57,1)",
        pointStrokeColor: "#fff",
        pointHighlightFill: "#fff",
        pointHighlightStroke: "rgba(221,75,57,0.8)"
    }, 
    { // green
        fillColor: "rgba(0,166,90,0.2)",
        strokeColor: "rgba(0,166,90,1)",
        pointColor: "rgba(0,166,90,1)",
        pointStrokeColor: "#fff",
        pointHighlightFill: "#fff",
        pointHighlightStroke: "rgba(0,166,90,0.8)"
    },
    { // yellow
        fillColor: "rgba(243,156,18,0.2)",
        strokeColor: "rgba(243,156,18,1)",
        pointColor: "rgba(243,156,18,1)",
        pointStrokeColor: "#fff",
        pointHighlightFill: "#fff",
        pointHighlightStroke: "rgba(243,156,18,0.8)"
    }];
  $scope.objectDetected = [];
  $scope.options = {
    responsive : true,
  };

  $scope.sse = $.SSE('http://localhost:8080/REST-API/detectedObject/serverSentEvents?cameraId=1', {
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
      if ($location.path() != "/statistics"){
        $scope.sse.stop();
      }
      $scope.$apply(function () {
        $scope.labels = ["Bikes", "Cars", "Buses/Trucks"];
        $scope.data = [$scope.bike, $scope.car, $scope.bus];
      });
    }    
  });
$scope.sse.start();
}]);

app.controller('barChartCtrl',['$scope','$http','$location', 'objectService', '$filter', function ($scope,$http,$location,objectService,$filter) { 
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

  $scope.showToday = true;
  $scope.showDay = false;
  $scope.showRange = false;

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

    objectService.searchObjects($scope.startDay, $scope.endDay).then(function (data) {
      $scope.draw($scope.tabs, data);
    }, function(){
      $scope.draw($scope.tabs, 0);
    });
  };
  
  objectService.detectedObject().then(function (data) {
    $scope.draw(0, data);
  });
  
  $scope.draw = function (tabs, data) {
    if (angular.isDefined()) {
      chart.destroy();
      delete chart;
    }
    $scope.tabs = tabs;
    if ($scope.tabs == 0) {
      $scope.legend = "All";
      $scope.colorUp = { // grey
        fillColor: "rgba(51,3,0,0.2)",
        strokeColor: "rgba(51,3,0,1)",
        pointColor: "rgba(51,3,0,1)",
        pointStrokeColor: "#fff",
        pointHighlightFill: "#fff",
        pointHighlightStroke: "rgba(51,3,0,0.8)"
      };
      $scope.colorDown = { // grey
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
    $scope.sundayDown = [];
    $scope.mondayDown = [];
    $scope.tuesdayDown = [];
    $scope.wednesdayDown = [];
    $scope.thursdayDown = [];
    $scope.fridayDown =[];
    $scope.saturdayDown = [];
    $scope.data = [];

    if(angular.isDefined(data)){
      $scope.values = data.data;
    }
   
    angular.forEach($scope.values, function (value, key) {
      if (value.objectType == $scope.objectType || $scope.objectType == 'All') {
        var date = new Date(value.date);
        if(date.getDay() == 0) {
          if (value.direction == "North")
            $scope.sundayUp.push(value);
          else
            $scope.sundayDown.push(value);           
        }
        else if(date.getDay() == 1) {
          if (value.direction == "North")
            $scope.mondayUp.push(value);
          else
            $scope.mondayDown.push(value);           
        }
        else if(date.getDay() == 2) {
          if (value.direction == "North")
            $scope.tuesdayUp.push(value);
          else
            $scope.tuesdayDown.push(value);           
        }
        else if(date.getDay() == 3) {
          if (value.direction == "North")
            $scope.wednesdayUp.push(value);
          else
            $scope.wednesdayDown.push(value);           
        }
        else if(date.getDay() == 4) {
          if (value.direction == "North")
            $scope.thursdayUp.push(value);
          else
            $scope.thursdayDown.push(value);           
        }
        else if(date.getDay() == 5) {
          if (value.direction == "North")
            $scope.fridayUp.push(value);
          else
            $scope.fridayDown.push(value);           
        }
        else if(date.getDay() == 6) {
          if (value.direction == "North")
            $scope.saturdayUp.push(value);
          else
            $scope.saturdayDown.push(value);           
        }
      }
    });
    $scope.$on('create', function (event, chart) {
       
        $scope.chart = chart;
        $scope.chart.destroy();
        
    });
    $scope.labels = ['Sunday', 'Monday', 'Thursday', 'Wednesday', 'Tuesday', 'Friday', 'Saturday'];
    $scope.series = [$scope.legend + '-Up', $scope.legend + '-Down'];
    $scope.data = [
      [$scope.sundayUp.length, $scope.mondayUp.length, $scope.tuesdayUp.length, $scope.wednesdayUp.length, $scope.thursdayUp.length, $scope.fridayUp.length, $scope.saturdayUp.length],
      [$scope.sundayDown.length, $scope.mondayDown.length, $scope.tuesdayDown.length, $scope.wednesdayDown.length, $scope.thursdayDown.length, $scope.fridayDown.length, $scope.saturdayDown.length]
    ];
    $scope.colours = [$scope.colorUp, $scope.colorDown];
  }
}]);

app.controller('rankingCtrl',['$scope','$http', 'rankingService', 'adminService', function ($scope,$http,rankingService,adminService) { 
  $scope.maxDate = new Date();
  $scope.minDate = new Date('2000');
  $scope.startDate = $scope.minDate;
  $scope.aux = new Date();
  $scope.selectedDate = new Date();
  
  $scope.year = $scope.aux.getFullYear();
  $scope.legend="";
  $scope.tabsHorizontal = 0;

  adminService.cameraList().then(function(data){
          $scope.cameras = data.data;
          $scope.activeTab(0);
  });

  $scope.activeTab = function(tab) {
    if (tab == 0) {
     
    } else if(tab == 1) {
      $scope.drawByYear($scope.year);
    } else if(tab == 2) {

    } else if(tab == 3) {

    }
  };
  $scope.drawByYear = function (year) {
    rankingService.rankingByYear(year).then(function (data) {
      $scope.drawHorizontalBar(data.data);
    });
  };

  $scope.drawHorizontalBar = function(data) {
    if(angular.isDefined($scope.chart)){
      $scope.chart.destroy();
    }

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

    var barChartData = {
      labels : labels,
      datasets : [{
        fillColor: "rgba(51,3,0,0.2)",
        strokeColor: "rgba(51,3,0,1)",
        pointColor: "rgba(51,3,0,1)",
        pointStrokeColor: "#fff",
        pointHighlightFill: "#fff",
        pointHighlightStroke: "rgba(51,3,0,0.8)",
        data : amount
      }]
    };
    
    var ctx = document.getElementById("canvas").getContext("2d");
    $scope.chart = new Chart(ctx).HorizontalBar(barChartData, {
      barShowStroke: false,
    }); 
  };

  $scope.open = function(selectedDate) {
    $scope.year = selectedDate.getFullYear();
    $scope.drawByYear($scope.year);
  }
}]);

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
                $scope.activeCamera($scope.values);
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

  $scope.level = 2;

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

  $scope.activeCamera = function(data){ 
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

  $scope.formCameraAllGood = function () {
    if($scope.locationGood && $scope.latitudeGood && $scope.longitudeGood && $scope.ipGood){
      adminService.addCamera($scope.myform.location.$viewValue,$scope.myform.latitude.$viewValue, $scope.myform.longitude.$viewValue, $scope.myform.ip.$viewValue, $scope.myform.activeCamera.$viewValue).then(function (response){
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
    $scope.myform.$setPristine();
    return ($scope.locationGood && $scope.latitudeGood && $scope.longitudeGood && $scope.ipGood)
  };
}]);