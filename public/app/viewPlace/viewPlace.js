'use strict'

angular.module('app')
.config(function ($stateProvider) {
  $stateProvider.state('viewPlace', {
    url: 'viewPlace',
    templateUrl: 'app/viewPlace/viewPlace.html',
    controller: 'viewPlaceCtrl',
    controllerAs: 'ctrl',
    parent: 'main'
  })
})
.controller('viewPlaceCtrl', function ($stateParams, $http,$rootScope, $state, LoginService, UserService) {
  const self = this
  
  function init () {
    if(!localStorage.token)
         $state.go('login');
    self.user=UserService.getCurrentUser();
    self.getPlacesUrl='http://18.220.85.229/api/users/'+self.user.userId+'/contributor_aboriginal_places?access_token='+self.user.access_token
    $http.get(self.getPlacesUrl, {
      params: {
        filter: {
          include:'present_day_place'       
        }
      }
    })
    .then((response) => {
      self.places=response.data
  })
  }

  init()
})