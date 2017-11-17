'use strict'

angular.module('app')
.directive('footer', function () {
  var controller = function ($scope) {
    var self = this
    self.webURL="localhost:3474"

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
  }

  return {
    restrict: 'E',
    templateUrl: 'components/footer/footer.html',
    controller: controller,
    controllerAs: 'ctrl'
  }
})