'use strict'

angular.module('app')
.config(function ($stateProvider) {
  $stateProvider.state('main', {
    abstract: true,
    url: '/',
    templateUrl: 'app/main/main.html',
    controller: 'mainCtrl',
    controllerAs: 'ctrl'
  })
})
.controller('mainCtrl', function ($http,$rootScope, $state, LoginService, UserService) {
  const self = this
  
  function init () {
  }

  init()
  $rootScope.$on('authorized', function() {
    localStorage.token=UserService.getCurrentUser().access_token;
    self.currentUser = UserService.getCurrentUser();
    

    });

  $rootScope.$on('unauthorized', function() {
      self.currentUser = UserService.setCurrentUser(null);
      $state.go('login');
  });
})