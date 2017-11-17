'use strict'

angular.module('app')
.config(function ($stateProvider) {
  $stateProvider.state('signUp', {
    url: '/signUp',
    templateUrl: 'app/signUp/signUp.html',
    controller: 'signUpCtrl',
    controllerAs: 'ctrl'
  })
})
.controller('signUpCtrl', function ($http, $state) {
  const self = this

  self.canSubmit = () => {
    if (!self.acceptedTOC) return false
    if (!self.user.email) return false
    if (!self.user.password) return false
    return true
  }

  self.submit = () => {
    if (!self.canSubmit()) return
    $http.post('http://18.220.85.229/api/users', self.user)
    .then((response) => {
      if (response.status === 422) {
        self.state = 'error'
        self.errorMessage = response.data.error.message
        return
      }
      self.state = 'success'
    })
  }

  self.reset = () => {
    self.user = {
      email: null,
      password: null
    }
    self.acceptedTOC = false
    self.state = 'signup'
    delete self.errorMessage
  }

  function init () {
    self.reset()
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