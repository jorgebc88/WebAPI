var app = angular.module('app.directives',[]);
app.directive('validUsername', function () {
  return {
    require: 'ngModel',
    link: function (scope, elm, attrs, ctrl) {
      ctrl.$parsers.unshift(function (viewValue) {
        var isBlank = viewValue === ''
        var invalidChars = !isBlank && !/^[A-z0-9]+$/.test(viewValue)
        ctrl.$setValidity('isBlank', !isBlank)
        ctrl.$setValidity('invalidChars', !invalidChars)
        scope.usernameGood = !isBlank && !invalidChars
      })
    }
  }
});
app.directive('validPassword', function () {
  return {
    require: 'ngModel',
    link: function (scope, elm, attrs, ctrl) {
      ctrl.$parsers.unshift(function (viewValue) {
        var isBlank = viewValue === ''
        var invalidLen = !isBlank && (viewValue.length < 8 || viewValue.length > 20)
        ctrl.$setValidity('isBlank', !isBlank)
        ctrl.$setValidity('invalidLen', !invalidLen)
        scope.passwordGood = !isBlank && !invalidLen
      })
    }
  }
});
app.directive('validPasswordC', function () {
  return {
    require: 'ngModel',
    link: function (scope, elm, attrs, ctrl) {
      ctrl.$parsers.unshift(function (viewValue, $scope) {
        var isBlank = viewValue === ''
        var noMatch = viewValue != scope.userForm.password.$viewValue
        ctrl.$setValidity('isBlank', !isBlank)
        ctrl.$setValidity('noMatch', !noMatch)
        scope.passwordCGood = !isBlank && !noMatch
      })
    }
  }
});
app.directive('validLocation', function () {
  return {
    require: 'ngModel',
    link: function (scope, elm, attrs, ctrl) {
      ctrl.$parsers.unshift(function (viewValue) {
        var isBlank = viewValue === ''
        ctrl.$setValidity('isBlank', !isBlank)
        scope.locationGood = !isBlank
      })
    }
  }
});
app.directive('validLatitude', function () {
  return {
    require: 'ngModel',
    link: function (scope, elm, attrs, ctrl) {
      ctrl.$parsers.unshift(function (viewValue) {
        var isBlank = viewValue === ''
        ctrl.$setValidity('isBlank', !isBlank)
        scope.latitudeGood = !isBlank
      })
    }
  }
});
app.directive('validLongitude', function () {
  return {
    require: 'ngModel',
    link: function (scope, elm, attrs, ctrl) {
      ctrl.$parsers.unshift(function (viewValue) {
        var isBlank = viewValue === ''
        ctrl.$setValidity('isBlank', !isBlank)
        scope.longitudeGood = !isBlank
      })
    }
  }
});
app.directive('validIp', function () {
  return {
    require: 'ngModel',
    link: function (scope, elm, attrs, ctrl) {
      ctrl.$parsers.unshift(function (viewValue) {
        var isBlank = viewValue === ''
        var invalidChars = !isBlank && !(/^([0-9]{1,3}).([0-9]{1,3}).([0-9]{1,3}).([0-9]{1,3}):([0-9]{0,4})/.test(viewValue))
        ctrl.$setValidity('isBlank', !isBlank)
        ctrl.$setValidity('invalidChars', !invalidChars)
        scope.ipGood = !isBlank && !invalidChars
      })
    }
  }
});
app.directive('ngEnter', function() {
  return function(scope, element, attrs) {
    element.bind("keydown keypress", function(event) {
      if(event.which === 13) {
        scope.$apply(function(){
          scope.$eval(attrs.ngEnter, {'event': event});
        });
        event.preventDefault();
      }
    });
  };
});