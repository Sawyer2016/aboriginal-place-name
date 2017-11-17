'use strict'

angular.module('app')
.config(function ($stateProvider) {
  $stateProvider.state('story', {
    url: 'story/:id',
    templateUrl: 'app/story/story.html',
    controller: 'StoryCtrl',
    controllerAs: 'ctrl',
    parent: 'main'
  })
})
.controller('StoryCtrl', function ($sce,$stateParams, $http,$rootScope, $state, LoginService, UserService) {
  const self = this
  const id = $stateParams.id || ''
  function init () {
    
    self.audioURLs=[];
    self.videoURLs=[];
    self.imgURLs=[];
    self.ifContributor=false;
     self.ifFav=null;

    if(localStorage.token){
     self.user = UserService.getCurrentUser(); 
     if(self.user.type==="contributor")
      self.ifContributor=true;
    if(self.user.type==='public'){
        self.favStoryURL='http://18.220.85.229/api/users/'+self.user.userId+'/fav_stories/'+id+'?access_token='+self.user.access_token;
       $http.get(self.favStoryURL)
        .then((response) => {
        if(response.status === 404){
          self.ifFav=false
        }
        else
           self.ifFav=true
        })
       }
    }
    
    self.webURL="http://localhost:3474/story/"+id
    $http.get(`http://18.220.85.229/api/Stories/${id}`, {
      params: {
        filter: {
          include:'assets'
        }
      }
    })
    .then((response) => {
      self.story = response.data
       response.data.assets.forEach((asset)=>{
        var assetURL=$sce.trustAsResourceUrl('http://18.220.85.229/api/Assets/'+asset.id+'/rawAsset');
        if(asset.type==='audio'){
          self.audioURLs.push(assetURL)
        }
        if(asset.type==='video'){
          self.videoURLs.push(assetURL)
        }
        if(asset.type==='image'){
          self.imgURLs.push(assetURL)
        }
       })
    })

  }

  init()
  
  self.setFav=()=>{
  self.storyMapURL='http://18.220.85.229/api/UserStoryMappings?access_token='+self.user.access_token;
  if(self.ifFav===true){

    self.ifFav=false;
     $http.get(self.storyMapURL,{
      params: {
        filter: {
          where:{
             story_id:id,
             user_id:self.user.userId
          }
        }
      }
    }).then((response)=>{
      $http.delete('http://18.220.85.229/api/UserStoryMappings/'+response.data[0].id+'?access_token='+self.user.access_token)
     })
  }
  else
    {
      self.ifFav=true;
      $http.post(self.storyMapURL,
      {
        story_id:id,
        user_id:self.user.userId
      }
      )
    }
  }

  self.shareToFacebook=()=>{
      window.open('https://www.facebook.com/sharer/sharer.php?u='+self.webURL)
    }
    self.shareToTwitter=()=>{
      window.open('https://twitter.com/home?status='+self.webURL)
    }
})
