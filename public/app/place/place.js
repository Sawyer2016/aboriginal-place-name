'use strict'

angular.module('app')
.config(function ($stateProvider) {
  $stateProvider.state('place', {
    url: 'place/:id',
    templateUrl: 'app/place/place.html',
    controller: 'PlaceCtrl',
    controllerAs: 'ctrl',
    parent: 'main'
  })
})



.controller('PlaceCtrl', function ($stateParams,$http,$scope,$sce,$rootScope, $state, LoginService, UserService) {
  const self = this;
  const placeURL='http://18.220.85.229/api/Places';
  const storyURL='http://18.220.85.229/api/Stories';
  const placeLangDataURL='http://18.220.85.229/api/PlaceLangData';
self.assets = [];
  self.placeAudioURL ="";
  // self.placeAssetURLs = [];
  // self.assetJSON = {};
  self.imgURL=[];
  self.videoURL=[];
  self.len = 0;
  self.lang_data = [];
  self.lang = "aaa";
  $scope.a  = 1;
  self.url = "";
 self.array = [];
  self.webURL="localhost:3474/place/"+$stateParams.id;
  self.ifFav=null;
  const id = $stateParams.id || ''

  function init () {
    
    $http.get(`http://18.220.85.229/api/AboriginalPlaces/${id}`, {
      params: {
        filter: {
          include:[
                  {relation:'lang'},
                  {relation:'present_day_place'},
                  {relation:'stories'},
                  {relation:'assets'}
                  ]
        }
      }
    })
    .then((response) => {
      self.place = response.data;
      self.assets = response.data.assets;
      self.len = response.data.assets.length;
      $scope.a = 3;
      self.lang = response.data.place_lang_data
      if(self.place.pronunciation_asset_id){
        self.placeAudioURL=$sce.trustAsResourceUrl('http://18.220.85.229/api/Assets/'+self.place.pronunciation_asset_id+'/rawAsset');
      }
      
      self.assets.forEach((asset)=>{
      self.url = $sce.trustAsResourceUrl("http://18.220.85.229/api/Assets/"+asset.id+"/rawAsset?");
        
        /*if(asset.type=="video"||asset.type=="image"){
          self.assetJSON = {"url":self.url};
           self.placeAssetURLs.push(self.assetJSON);
        }*/
        if(asset.type=="video"){
          self.videoURL.push(self.url);
        }
        if(asset.type=="image"){
          self.imgURL.push(self.url);
        }
        })

      })

    //check if it is favourite place
    if(localStorage.token)
     {
       self.user = UserService.getCurrentUser(); 
       if(self.user.type==='public'){
        self.favPlaceURL='http://18.220.85.229/api/users/'+self.user.userId+'/fav_aboriginal_places/'+id+'?access_token='+self.user.access_token;
       $http.get(self.favPlaceURL)
        .then((response) => {
        if(response.status === 404){
          self.ifFav=false
        }
        else
           self.ifFav=true
        })
       }
      }
    }



/*self.trustURL=(item)=>{
  if(item.assets){
   return $sce.trustAsResourceUrl("http://18.220.85.229/api/Assets/"+item.assets["0"].id+"/rawAsset");
  }
}*/
self.setFav=()=>{
  self.placeMapURL='http://18.220.85.229/api/UserAboriginalPlaceMappings?access_token='+self.user.access_token;
  if(self.ifFav===true){

    self.ifFav=false;
     $http.get(self.placeMapURL,{
      params: {
        filter: {
          where:{
             aboriginal_place_id:id,
             user_id:self.user.userId
          }
        }
      }
    }).then((response)=>{
      $http.delete('http://18.220.85.229/api/UserAboriginalPlaceMappings/'+response.data[0].id+'?access_token='+self.user.access_token)
     })
  }
  else
    {
      self.ifFav=true;
      $http.post(self.placeMapURL,
      {
        aboriginal_place_id:id,
        user_id:self.user.userId
      }
      )
    }
  }

self.shareToFacebook=()=>{
      window.open('https://www.facebook.com/sharer/sharer.php?u='+self.webURL)
    }
self.shareToTwitter=()=>{
  window.open('https://twitter.com/home?status='+self.webURL)
}

  init()
//  sceurl($scope,$sce);
  $scope.a=self.assets.length;
//  loadMedia();
})

.directive("owlCarousel", function() {
  return {
    restrict: 'E',
    transclude: false,
    link: function (scope) {
      scope.initCarousel = function(element) {
        // provide any default options you want
        var defaultOptions = {
          navigation:true
        };
        var customOptions = scope.$eval($(element).attr('data-options'));
        // combine the two options objects
        for(var key in customOptions) {
          defaultOptions[key] = customOptions[key];
        }
        // init carousel
        $(element).owlCarousel(defaultOptions);
      };
    }
  };
})
.directive('owlCarouselItem', [function() {
  return {
    restrict: 'A',
    transclude: false,
    link: function(scope, element) {
      // wait for the last item in the ng-repeat then call init
      if(scope.$last) {
        scope.initCarousel(element.parent());
      }
    }
  };
}]);
