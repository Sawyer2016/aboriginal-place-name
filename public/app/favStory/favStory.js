'use strict'

angular.module('app')
.config(function ($stateProvider) {
  $stateProvider.state('favStory', {
    url: 'favStory',
    templateUrl: 'app/favStory/favStory.html',
    controller: 'favStoryCtrl',
    controllerAs: 'ctrl',
    parent: 'main'
  })
})
.controller('favStoryCtrl', function ($stateParams, $http,$rootScope, $state, LoginService, UserService) {
  const self = this
  
  function init () {
    if(!localStorage.token)
         $state.go('login');
    self.user=UserService.getCurrentUser();
    self.selectedList=[];
    self.favStoryURL="http://18.220.85.229/api/users/"+self.user.userId+'/fav_stories?access_token='+self.user.access_token;
     $http.get(self.favStoryURL,{
      params: {
        filter: {
          include:{
            relation:'aboriginal_place',
            scope:{
              include:'present_day_place'
            }
          }      
        }
      }
    })
        .then((response) => {
          self.favStories=response.data
        })
  }

  init()

  self.toggleSelection=(id)=> {
     var idx =  self.selectedList.indexOf(id);

     // is currently selected
     if (idx > -1) {
        self.selectedList.splice(idx, 1);
     }

     // is newly selected
     else {
        self.selectedList.push(id);
     }
   }

  self.remove=()=>{
    var num=0;
    self.StoryMapURL='http://18.220.85.229/api/UserStoryMappings?access_token='+self.user.access_token;
    self.selectedList.forEach((StoryId)=>{
      $http.get(self.StoryMapURL,{
      params: {
        filter: {
          where:{
             story_id:StoryId,
             user_id:self.user.userId
          }
        }
      }
    }).then((response)=>{
    $http.delete('http://18.220.85.229/api/UserStoryMappings/'+response.data[0].id+'?access_token='+self.user.access_token)
    .then((res)=>{
      num++;
     if(num===self.selectedList.length){
      $state.reload()
     }
    })
     
    })

    })
  }
})