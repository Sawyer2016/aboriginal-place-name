'use strict'

angular.module('app')
.config(function ($stateProvider) {
  $stateProvider.state('addLang', {
    url: 'addLang',
    templateUrl: 'app/addLang/addLang.html',
    controller: 'addLangCtrl',
    controllerAs: 'ctrl',
    parent:'main'
  })
})
.controller('addLangCtrl', function ($stateParams, $http,$rootScope, $state, LoginService, UserService) {
  const self = this
  function init () { 
    if(!localStorage.token)
         $state.go('login');
    self.user = UserService.getCurrentUser();
  }

  init()

  self.add=(lang)=>{
    $http.post("http://18.220.85.229/api/Langs?access_token="+self.user.access_token, 
    {
      "lang":lang.lang,
      "notes":lang.notes,
      "name":lang.lang
    })
    .then((response)=>{
          $state.go('manageLang');
    })
    
  }
})