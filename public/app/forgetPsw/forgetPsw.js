'use strict'

angular.module('app')
.config(function ($stateProvider) {
  $stateProvider.state('forgetPsw', {
    url: '/forgetPsw',
    templateUrl: 'app/forgetPsw/forgetPsw.html',
    controller: 'forgetPswCtrl',
    controllerAs: 'ctrl'
  })
})
.controller('forgetPswCtrl', function ($http) {
  const self = this

  self.canSend = () => {
    if (!self.user.email) return false
    return true
  }

  self.send = () => {
    $http.post('http://18.220.85.229/api/users/reset', self.user)
    .then(() => {
      self.state = 'sent'
    })
  }
  
  function init () {
    self.state = 'notsent'
    self.user = { email: null }
  }

  init()

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