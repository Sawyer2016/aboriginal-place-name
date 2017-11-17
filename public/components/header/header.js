'use strict'

angular.module('app')
.directive('header', function () {
  var controller = function ($scope,$stateParams, $http,$rootScope, $state, LoginService, UserService) {
    var self = this
    if(UserService.getCurrentUser())
    	{
    	$("#login").css("display","none")
    	$("#logout").css("display","block");
    	}
    else{
    	$("#login").css("display","block")
    	$("#logout").css("display","none");
    }
    $scope.logout=()=>{
    	self.user=UserService.getCurrentUser();
    	var logoutURL="http://18.220.85.229/api/users/logout?access_token="+self.user.access_token;
    	 $http.post(logoutURL)
    	 .then((response)=>{

    	  UserService.setCurrentUser(null);
    	  localStorage.clear();
          $state.go('login');
        })
    }
  }

  return {
    restrict: 'E',
    templateUrl: 'components/header/header.html',
    controller: controller,
    controllerAs: 'ctrl'
  }
})