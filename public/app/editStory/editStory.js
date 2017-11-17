'use strict'

angular.module('app')
.config(function ($stateProvider) {
  $stateProvider.state('editStory', {
    url: 'editStory/:id',
    templateUrl: 'app/editStory/editStory.html',
    controller: 'editStoryCtrl',
    controllerAs: 'ctrl',
    parent:'main'
  })
})
.controller('editStoryCtrl', function ($stateParams, $http,$rootScope, $state, LoginService, UserService) {
  const self = this
  const id=$stateParams.id || ''
  function init () {
    self.type="";
    self.user = UserService.getCurrentUser();
    self.getPlacesUrl='http://18.220.85.229/api/users/'+self.user.userId+'/contributor_aboriginal_places?access_token='+self.user.access_token
     if(!localStorage.token)
         $state.go('login');
    $http.get(`http://18.220.85.229/api/Stories/${id}`, {
      params: {
        filter: {
          include:['assets','aboriginal_place']
        }
      }
    })
    .then((response) => {
      self.story=response.data
      console.log(self.story)
    })

    $http.get(self.getPlacesUrl)
    .then((response) => {
      self.abPlaces=response.data
  })

  }

  init()

  self.update=(story)=>{
    $http.patch("http://18.220.85.229/api/Stories/"+id+"?access_token="+self.user.access_token, 
    {
      title:story.title,
      text:story.text,
      aboriginal_place_id:story.abPlace
    })
    .then((response)=>{
          $state.go('viewStory');
        })
    
  }
  self.delete=()=>{
    $http.delete("http://18.220.85.229/api/Stories/"+id+"?access_token="+self.user.access_token)
    .then((response)=>{
          $state.go('viewStory');
        })
  }
})