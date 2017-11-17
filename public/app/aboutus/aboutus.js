'use strict'

angular.module('app')
.config(function ($stateProvider) {
  $stateProvider.state('aboutus', {
    url: 'aboutus',
    templateUrl: 'app/aboutus/aboutus.html',
    controller: 'AboutUsCtrl',
    controllerAs: 'ctrl',
    parent:'main'
  })
})
.controller('AboutUsCtrl', function () {
  const self = this

  function init () {
    self.foo = 'bar'
  }

  init()
})