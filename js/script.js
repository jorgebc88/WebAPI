var app = angular.module('myApp', ['app.controllers','app.services','app.directives','ngRoute','ngResource','ngCookies']);
app.run(['$rootScope', '$location','$cookieStore',function($rootScope, $location,$cookieStore){
  $rootScope.$on('$routeChangeStart',function(event, next, current){
    if($cookieStore.get('connected') == false || $cookieStore.get('connected') == null ){
      if(next.templateUrl == 'pages/home/home.html' || next.templateUrl == 'pages/barChart/barChart.html' || next.templateUrl == 'pages/admin/admin.html'){
        $location.path('/');
      }
    }
    else
    {
      var level = $cookieStore.get('level');
      if(next.templateUrl == 'pages/login/login.html' || (next.templateUrl == 'pages/admin/admin.html' && level != 1) ){
        $location.path('/home');
      }
    }
  })
}]);
app.config(function($datepickerProvider) {
  angular.extend($datepickerProvider.defaults, {
    dateFormat: 'dd/MM/yyyy',
    startWeek: 1
  });
});
app.config(['$routeProvider', function($routeProvider) {
  $routeProvider
  .when('/', {
    templateUrl: 'pages/login/login.html',
    controller: 'loginCtrl'
  })
  .when('/home', {
    controller: 'homeCtrl',
    templateUrl: 'pages/home/home.html'
  })
  .when('/statistics', {
    controller: 'pieChartCtrl',
    templateUrl: 'pages/pieChart/pieChart.html'
  })
  .when('/stats', {
    controller: 'barChartCtrl',
    templateUrl: 'pages/barChart/barChart.html'
  })
  .when('/ranking', {
    controller: 'rankingCtrl',
    templateUrl: 'pages/ranking/ranking.html'
  })
  .when('/trafficFlow', {
    controller: 'trafficFlowCtrl',
    templateUrl: 'pages/trafficFlow/trafficFlow.html'
  })
  .when('/admin', {
    controller: 'adminCtrl',
    templateUrl: 'pages/admin/admin.html'
  })
  .otherwise({
    redirectTo: '/'
  });
}]);
