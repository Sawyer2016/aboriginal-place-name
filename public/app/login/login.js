'use strict'

angular.module('app')
.config(function ($stateProvider) {
  $stateProvider.state('login', {
    url: '/login',
    templateUrl: 'app/login/login.html',
    controller: 'loginCtrl',
    controllerAs: 'ctrl'
  })
})
.controller('loginCtrl', function ($window,$stateParams, $http,$rootScope, $state, LoginService, UserService) {
  const self = this
  function init () {

  }

  init()

        function signIn(user) {
            LoginService.login(user)
                .then(function(response) {
                  if(response.data.id){
                    user.access_token = response.data.id;
                    user.userId=response.data.userId;
                     self.roleURL='http://18.220.85.229/api/users/'+user.userId+'/roles?access_token='+user.access_token;
                     $http.get(self.roleURL).then((response)=>{
                         if(response.data[0]){
                      user.type=response.data[0].name;
                     }
                     else{
                      user.type="public"
                     }
                     UserService.setCurrentUser(user);
                    $rootScope.$broadcast('authorized');
                    $state.go('personalInfo');
                      })
                    
                  }
                  else{
                     $window.location.reload();
                  }
                });
        }

        function register(user) {
            LoginService.register(user)
                .then(function(response) {
                    login(user);
                });
        }

        function submit(user) {
            self.newUser ? register(user) : signIn(user);
        }

        self.newUser = false;
        self.submit = submit;
        
        self.shareToFacebook=()=>{
          window.open('https://www.facebook.com/VACLANG?ref=stream')
        }
        self.shareToTwitter=()=>{
          window.open('https://twitter.com/VACL')
        }
        self.shareToInstagram=()=>{
          window.open('https://www.instagram.com/vaclang/')
        }
        self.shareToSoundCloud=()=>{
          window.open('https://soundcloud.com/vacl-981864418')
        }
        self.shareToVimeo=()=>{
          window.open('https://vimeo.com/vacl')
        }
        self.shareToAndroid=()=>{
          
        }
        self.shareToIOS=()=>{
         
        }
})