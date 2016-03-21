var app = angular.module('app.controllers',['app.adminCtrl', 'app.barChartCtrl', 'app.homeCtrl', 'app.loginCtrl', 'app.pieChartCtrl', 'app.rankingCtrl', 'app.trafficFlowCtrl', 'ngRoute','ngResource','ngCookies','ngSanitize','ngAnimate', 'chart.js','duScroll','mgcrea.ngStrap','mgcrea.ngStrap.helpers.parseOptions', 'datatables', 'datatables.select', 'datatables.buttons', 'datatables.bootstrap','ui.select']);

app.controller('indexCtrl',['$scope','$cookieStore','$location','userConService','$http', '$modal', '$aside', function ($scope,$cookieStore,$location,userConService,$http,$modal,$aside){  
	var myOtherAside = $aside({scope: $scope, show: false, template: 'pages/menu.html', animation: "am-fade-and-slide-left", placement: "left"});

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
	{text: 'Bar chart stats', href: '#/stats#statistics'},
	{text: 'Rankings', href: '#/ranking#statistics'},
	{text: 'Traffic flow statistics', href: '#/trafficFlow#statistics'}
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

	var myOtherModal = $modal({title : 'Are you sure you want to logout?',scope: $scope, template: 'pages/modal.html', show: false});

	$scope.showModal = function() {
		myOtherAside.$promise.then(myOtherAside.hide());
		myOtherModal.$promise.then(myOtherModal.show);
	};

	$scope.logout = function(){
		$http.get('http://localhost:8080/REST-API/user/logout');
		$scope.userConnected = {'name': "", 'level': "", 'connected':""};
		$cookieStore.remove('connected');
		$cookieStore.remove('level');
		$cookieStore.remove('user');
		$location.path('/');
		myOtherModal.$promise.then(myOtherModal.hide);
	};
}]);