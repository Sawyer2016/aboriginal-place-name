'use strict'

angular.module('app')
.config(function ($stateProvider) {
  $stateProvider.state('addUser', {
    url: 'addUser',
    templateUrl: 'app/addUser/addUser.html',
    controller: 'addUserCtrl',
    controllerAs: 'ctrl',
    parent:'main'
  })
})
.controller('addUserCtrl', function ($stateParams, $http,$rootScope, $state, LoginService, UserService) {
  const self = this
  
  function init () {
    if(!localStorage.token)
         $state.go('login');
    self.user = UserService.getCurrentUser();
    self.ifContributor=false;
    self.placesURL='http://18.220.85.229/api/AboriginalPlaces'
    self.userURL='http://18.220.85.229/api/users?access_token='+self.user.access_token
    self.roleURL='http://18.220.85.229/api/Roles?access_token='+self.user.access_token
    self.placeMappingURL='http://18.220.85.229/api/ContributorAboriginalPlaceMappings?access_token='+self.user.access_token
    $http.get(self.placesURL,{
       params: {
        filter: {
          fields:{
            'trad_aboriginal_name':true,
            'id':true
          },
          order: 'name ASC'     
        }
      }
    })
    .then((response) => {
      self.places=response.data
    })

   $http.get(self.roleURL)
    .then((response) => {
      response.data.forEach((role)=>{
        if(role.name==='admin')
          self.adminId=role.id
        else if(role.name==='contributor')
          self.contributorId=role.id
      })
    })

  }

  init()

  self.changeRole=()=>{
    if(self.newUser.role==='contributor')
      self.ifContributor=true;
    else
      self.ifContributor=false;
  }

  self.add=(user)=>{
    $http.post(self.userURL,{
    'email':user.email,
    'firstname':user.firstname,
    'lastname':user.lastname,
    'password':user.password,
    'contact':user.contact
    })
    .then((response) => {
      self.createdUser=response.data
      console.log(response.data)
      var roleId=''
      if(user.role!='public'){
        if(user.role==='admin')
          roleId=self.adminId
        else
          roleId=self.contributorId
        $http.post('http://18.220.85.229/api/RoleMappings?access_token='+self.user.access_token,
        {
         'principalId':self.createdUser.id,
         'roleId':roleId,
         "principalType": "USER",
        })
        .then((res) => {
          if(user.role==='contributor'){
            var num=0;
            self.newUser.accessPlace.forEach((place)=>{
              $http.post(self.placeMappingURL,
              {
               "aboriginal_place_id":place.id,
               "user_id":self.createdUser.id
              }).then((result) => {
                num++;
                if(num===self.newUser.accessPlace.length){
                  $state.go('manageUser');
                }
              })
            })
            
          }

        })
      }
    })
  }
})