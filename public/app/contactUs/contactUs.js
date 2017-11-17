'use strict'

angular.module('app')
.config(function ($stateProvider) {
  $stateProvider.state('contactUs', {
    url: 'contactUs',
    templateUrl: 'app/contactUs/contactUs.html',
    controller: 'contactUsCtrl',
    controllerAs: 'ctrl',
    parent: 'main'
  })
})
.controller('contactUsCtrl', function ($http) {
  const self = this

  self.canSubmit = () => {
    if (!self.user.name) return false
    if (!self.user.email) return false
    if (!self.user.subject) return false
    if (!self.user.topic) return false
    return true
  }

  self.submit = () => {
    self.state = 'sending'
    $http.post('http://18.220.85.229/contact-us', self.user)
    .then((response) => {
      if (response.status !== 200) {
        self.state = 'error'
        return
      }
      self.state = 'success'
    })
  }

  self.reset =() => {
    self.user = {
      name: null,
      telephone: null,
      placename: null,
      email: null,
      subject: null,
      topic: null,
      message: null
    }
    self.state = 'contact'
    self.topics = [
      'Submit information about a Place',
      'Register as an Aboriginal Contributor',
      'General Help',
      'Other',
    ]
  }

  function init () {
    self.reset()
  }

  init()
})