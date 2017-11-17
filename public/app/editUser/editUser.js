'use strict'

angular.module('app')
.config(function ($stateProvider) {
  $stateProvider.state('editUser', {
    url: 'editUser/:id',
    templateUrl: 'app/editUser/editUser.html',
    controller: 'editUserCtrl',
    controllerAs: 'ctrl',
    parent:'main'
  })
})
.controller('editUserCtrl', function ($stateParams, $http,$rootScope, $state, LoginService, UserService) {
  const self = this
  const id=$stateParams.id || ''
  function init () {
    self.type="";
    if(!localStorage.token)
      $state.go('login');
    self.user = UserService.getCurrentUser();
    self.ifContributor=false;
    self.placesURL='http://18.220.85.229/api/AboriginalPlaces'
    self.roleURL='http://18.220.85.229/api/Roles?access_token='+self.user.access_token
    self.roleMappingURL='http://18.220.85.229/api/RoleMapping?access_token='+self.user.access_token
     $http.get(self.placesURL,{
       params: {
        filter: {
          fields:{
            'trad_aboriginal_name':true,
            'id':true
          },
          limit:5,
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
    if(self.userInfo.role==='contributor')
      self.ifContributor=true;
    else
      self.ifContributor=false;
    console.log(self.ifContributor)
  }

  self.update=(user)=>{
  if(user.role==='admin')
    roleId=self.adminId
  else
    roleId=self.contributorId

  //update information
  $http.patch(self.userURL,{
    "firstname":user.firstname,
    "lastname":user.lastname,
    "contact":user.contact
  })
  .then((response) => {
    self.userInfo=response.data
  })

  //update role
  $http.get(self.roleMappingURL,
  {
    params: {
        filter: {
        where:{
          'principaiId':id
        }    
        }
      }
  })
  .then((response) => {
    if(!response.data){
      $http.post(self.roleMappingURL,
        {
         'principalId':id,
         'roleId':roleId
        })
        .then((res) => {
        })
    }
    else{
     $http.patch('http://18.220.85.229/api/RoleMapping/'+response.data.id+'?access_token='+self.user.access_token,
      {
       'roleId':roleId
      })
      .then((res) => {
      })
    }
  })
  }

  //update access places

})