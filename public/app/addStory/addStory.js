'use strict'

angular.module('app')
.config(function ($stateProvider) {
  $stateProvider.state('addStory', {
    url: 'addStory',
    templateUrl: 'app/addStory/addStory.html',
    controller: 'addStoryCtrl',
    controllerAs: 'ctrl',
    parent:'main'
  })
})
.controller('addStoryCtrl', function ($stateParams, $http,$rootScope, $state, LoginService, UserService) {
  const self = this
  function init () {
    self.type="";
    self.user = UserService.getCurrentUser();
    if(!localStorage.token)
         $state.go('login');
    self.getPlacesUrl='http://18.220.85.229/api/users/'+self.user.userId+'/contributor_aboriginal_places?access_token='+self.user.access_token
    $http.get(self.getPlacesUrl, {
      params: {
        filter: {
          include:'present_day_place'       
        }
      }
    })
    .then((response) => {
      self.abPlaces=response.data
      console.log(self.abPlaces)
  })

  }

  init()

  self.update=(story)=>{
    $http.post("http://18.220.85.229/api/Stories?access_token="+self.user.access_token, 
    {
      title:self.story.title,
      text:self.story.text,
      aboriginal_place_id:self.story.abPlace
    })
    .then((response)=>{
          $state.go('viewStory');
        })
    
  }
})