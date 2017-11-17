'use strict'

angular.module('app')
.config(function ($stateProvider) {
  $stateProvider.state('viewStory', {
    url: 'viewStory',
    templateUrl: 'app/viewStory/viewStory.html',
    controller: 'viewStoryCtrl',
    controllerAs: 'ctrl',
    parent: 'main'
  })
})
.controller('viewStoryCtrl', function ($stateParams, $http,$rootScope, $state, LoginService, UserService) {
  const self = this
  
  function init () {
    if(!localStorage.token)
         $state.go('login');
    self.user=UserService.getCurrentUser();
    self.stories=[];
    self.getPlacesUrl='http://18.220.85.229/api/users/'+self.user.userId+'/contributor_aboriginal_places?access_token='+self.user.access_token
    $http.get(self.getPlacesUrl, {
      params: {
        filter: {
          include:['present_day_place','stories']       
        }
      }
    })
    .then((response) => {
      response.data.forEach((place)=>{
        if(place.stories){
          var abName=place.trad_aboriginal_name;
          var presentName=place.present_day_place.name;
          place.stories.forEach((story)=>{
            self.stories.push({"id":story.id,"story":story.title,"abName":abName,"presentName":presentName})
          })
        }
      })
  })
  }

  init()
})