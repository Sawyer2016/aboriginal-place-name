'use strict'

angular.module('app')
.config(function ($stateProvider) {
  $stateProvider.state('favPlace', {
    url: 'favPlace',
    templateUrl: 'app/favPlace/favPlace.html',
    controller: 'favPlaceCtrl',
    controllerAs: 'ctrl',
    parent: 'main'
  })
})
.controller('favPlaceCtrl', function ($stateParams, $http,$rootScope, $state, LoginService, UserService) {
  const self = this
  
  function init () {
    if(!localStorage.token)
         $state.go('login');
    self.user=UserService.getCurrentUser();
    self.selectedList=[];
    self.favPlaceURL="http://18.220.85.229/api/users/"+self.user.userId+'/fav_aboriginal_places?access_token='+self.user.access_token;
     $http.get(self.favPlaceURL,{
      params: {
        filter: {
          include:'present_day_place'      
        }
      }
    })
        .then((response) => {
          self.favPlaces=response.data
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
    self.placeMapURL='http://18.220.85.229/api/UserAboriginalPlaceMappings?access_token='+self.user.access_token;
    self.selectedList.forEach((placeId)=>{
      $http.get(self.placeMapURL,{
      params: {
        filter: {
          where:{
             aboriginal_place_id:placeId,
             user_id:self.user.userId
          }
        }
      }
    }).then((response)=>{
    $http.delete('http://18.220.85.229/api/UserAboriginalPlaceMappings/'+response.data[0].id+'?access_token='+self.user.access_token)
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