'use strict'

angular.module('app')
.config(function ($stateProvider) {
  $stateProvider.state('addExistingPlace', {
    url: 'addExistingPlace',
    templateUrl: 'app/addExistingPlace/addExistingPlace.html',
    controller: 'addExistingPlaceCtrl',
    controllerAs: 'ctrl',
    parent:'main'
  })
})
.controller('addExistingPlaceCtrl', function ($stateParams, $http,$rootScope, $state, LoginService, UserService) {
  const self = this
  function init () { 
    if(!localStorage.token)
         $state.go('login');
    self.user = UserService.getCurrentUser();
    self.placeURL="http://18.220.85.229/api/PresentDayPlaces?access_token="+self.user.access_token
    self.municipalities=["Melbourne","Malvern","Richmond","Ivanhoe","Camberwell"]

  }

  init()

  self.add=(place)=>{
    $http.post(self.placeURL, 
    {
      "name": place.name,
      "history": "1",
      "discussion": "1",
      "year_of_origin": 0,
      "geopoint": {
        "lat": 0,
        "lng": 0
      },
      "municipality":place.municipality
    })
    .then((response)=>{
          $state.go('manageExistingPlace');
    })
    
  }
})