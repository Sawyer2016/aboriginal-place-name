'use strict'

angular.module('app')
.config(function ($stateProvider,$httpProvider) {
  $stateProvider.state('personalInfo', {
    url: 'personalInfo',
    templateUrl: 'app/personalInfo/personalInfo.html',
    controller: 'personalInfoCtrl',
    controllerAs: 'ctrl',
    parent: 'main',
  })
})
.controller('personalInfoCtrl', function ($stateParams, $http,$rootScope, $state, LoginService, UserService,$scope) {
  const self = this
  self.type="";
  



  function init () {
     if(!localStorage.token)
         $state.go('login');
      else{
      self.user = UserService.getCurrentUser();
      self.type=self.user.type;

      

      var userURL="http://18.220.85.229/api/users/"+self.user.userId+'?access_token='+self.user.access_token;
      $http.get(userURL)
        .then((response) => {
          self.userInfo=response.data
        })
      }
    
  }

  init()
 



})