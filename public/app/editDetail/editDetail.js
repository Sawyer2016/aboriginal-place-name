'use strict'

angular.module('app')
.config(function ($stateProvider) {
  $stateProvider.state('editDetail', {
    url: 'editDetail',
    templateUrl: 'app/editDetail/editDetail.html',
    controller: 'editDetailCtrl',
    controllerAs: 'ctrl',
    parent:'main'
  })
})
.controller('editDetailCtrl', function ($stateParams, $http,$rootScope, $state, LoginService, UserService) {
  const self = this
  
  function init () {
    self.type="";
     if(!localStorage.token)
         $state.go('login');
      else{
      self.user = UserService.getCurrentUser();
      self.type=self.user.type;
      self.userURL="http://18.220.85.229/api/users/"+self.user.userId+'?access_token='+self.user.access_token;
      $http.get(self.userURL)
        .then((response) => {
          self.userInfo=response.data
        })
        
      if(self.type==="contributor") {
        self.contributorPlaceURL="http://18.220.85.229/api/users/"+self.user.userId+'/contributor_aboriginal_places?access_token='+self.user.access_token;
        $http.get(self.contributorPlaceURL,{
        params: {
          filter: {
            include:'lang'      
          }
        }
        }).then((response) => {
            self.contributorPlaces=response.data
          })
      }      
      }
  }

  init()


   self.update=(user)=>{
    $http.patch(self.userURL,{
      "firstname":user.firstname,
      "lastname":user.lastname,
      "contact":user.contact
    })
        .then((response) => {
          self.userInfo=response.data
        })
    $state.go('personalInfo');

  }

})