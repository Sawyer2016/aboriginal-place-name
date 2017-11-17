'use strict'

angular.module('app')
.config(function ($stateProvider) {
  $stateProvider.state('editLang', {
    url: 'editLang/:id',
    templateUrl: 'app/editLang/editLang.html',
    controller: 'editLangCtrl',
    controllerAs: 'ctrl',
    parent:'main'
  })
})
.controller('editLangCtrl', function ($stateParams, $http,$rootScope, $state, LoginService, UserService) {
  const self = this
  const id=$stateParams.id || ''
  function init () { 
    if(!localStorage.token)
         $state.go('login');
    self.user = UserService.getCurrentUser();
    self.langURL="http://18.220.85.229/api/Langs/"+id+"?access_token="+self.user.access_token
    $http.get(self.langURL)
    .then((response)=>{
      self.Lang=response.data
    })
  }

  init()

  self.update=(lang)=>{
    $http.patch(self.langURL, 
    {
      "lang":lang.lang,
      "notes":lang.notes,
      "name":lang.lang
    })
    .then((response)=>{
      $state.go('manageLang');
    })
    
  }

  self.delete=()=>{
    $http.delete(self.langURL)
    .then((response)=>{
      $state.go('manageLang');
    })
  }
})