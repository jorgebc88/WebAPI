var app = angular.module('app.adminService',[]);

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

  var addCamera = function (location, latitude, longitude, ip, pointingAt, active){
    return $http.post('http://192.168.2.120:8080/REST-API/camera/newCamera', {"location": location, "latitude": latitude, "longitude": longitude, "ip": ip, "active": active, "pointingAt": pointingAt});
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


