'use strict'

angular.module('app')
.config(function ($stateProvider) {
  $stateProvider.state('home', {
    url: 'home',
    templateUrl: 'app/home/home.html',
    controller: 'HomeCtrl',
    controllerAs: 'ctrl',
    parent: 'main'
  })
})
.controller('HomeCtrl', function () {
  const self = this

  function init () {
    var popup= localStorage.getItem('myPopup');
    if(!popup){
      $('#myModal').reveal();
      localStorage.setItem('myPopup','true');
      }
    }


  init()
})