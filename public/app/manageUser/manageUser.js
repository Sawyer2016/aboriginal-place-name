'use strict'

angular.module('app')
.config(function ($stateProvider) {
  $stateProvider.state('manageUser', {
    url: 'manageUser',
    templateUrl: 'app/manageUser/manageUser.html',
    controller: 'manageUserCtrl',
    controllerAs: 'ctrl',
    parent: 'main'
  })
})
.controller('manageUserCtrl', function ($stateParams, $http,$rootScope, $state, LoginService, UserService) {
  const self = this
  
  function init () {
  if(!localStorage.token)
       $state.go('login');
  self.user=UserService.getCurrentUser();
  }

  init()

})