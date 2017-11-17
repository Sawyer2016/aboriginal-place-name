'use strict'

angular.module('app')
.config(function ($stateProvider) {
  $stateProvider.state('editExistingPlace', {
    url: 'editExistingPlace/:id',
    templateUrl: 'app/editExistingPlace/editExistingPlace.html',
    controller: 'editExistingPlaceCtrl',
    controllerAs: 'ctrl',
    parent:'main'
  })
})
.controller('editExistingPlaceCtrl', function ($stateParams, $http,$rootScope, $state, LoginService, UserService) {
  const self = this
  const id=$stateParams.id || ''
  function init () { 
    if(!localStorage.token)
         $state.go('login');
    self.user = UserService.getCurrentUser();
    self.placeURL="http://18.220.85.229/api/PresentDayPlaces/"+id+"?access_token="+self.user.access_token
    self.municipalities=["Melbourne","Malvern","Richmond","Ivanhoe","Camberwell"]

    $http.get(self.placeURL, 
    {
      params: {
        filter: {
          fields:{
            'municipality':true,
            'name':true,
            'id':true
          },
        }
      }
    })
    .then((response)=>{
      self.ExistingPlace=response.data
    })

  }

  init()

  self.update=(place)=>{
    $http.patch(self.placeURL, 
    {
      "name": place.name,
      "municipality":place.municipality
    })
    .then((response)=>{
      $state.go('manageExistingPlace');
    })  
  }

  self.delete=()=>{
    $http.delete(self.placeURL)
    .then((response)=>{
      $state.go('manageExistingPlace');
    })
  }
})