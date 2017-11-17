'use strict'

angular.module('app')
.config(function ($stateProvider) {
  $stateProvider.state('addPlace', {
    url: 'addPlace',
    templateUrl: 'app/addPlace/addPlace.html',
    controller: 'addPlaceCtrl',
    controllerAs: 'ctrl',
    parent:'main'
  })
})
.controller('addPlaceCtrl', function ($scope,$stateParams, $http,$rootScope, $state, LoginService, UserService) {
  const self = this
  function init () { 
    if(!localStorage.token)
         $state.go('login');
    self.user = UserService.getCurrentUser();
    self.presentPlaceURL='http://18.220.85.229/api/PresentDayPlaces'
    self.langURL="http://18.220.85.229/api/Langs"
    self.newAssets=[]
    self.uploadState = 'ready'
    $http.get(self.presentPlaceURL,{
       params: {
        filter: {
          fields:{
            'name':true,
            'id':true
          },
          order: 'name ASC'     
        }
      }
    })
    .then((response) => {
      self.presentPlaces=response.data
    })

    $http.get(self.langURL)
    .then((response) => {
      self.langs=response.data
    })

  }

  init()
  

  $scope.fileSelected = (files) => {
    self.file = files[0]
    $scope.$apply()
  }

  self.canUpload = () => {
    if (!self.file) return false
    return true
  }

  self.resetUploadForm = () => {
    self.uploadState = 'ready'
  }

  self.uploadAsset = () => {
    const tok = self.user.access_token
    const url = `http://18.220.85.229/api/Assets/rawAsset?access_token=${tok}`
    if (!self.file) {
      console.log(`No file selected.`)
      return
    }
    self.uploadState = 'uploading'
    const fd = new FormData()
    fd.append(`asset`, self.file)
    $http.post(url, fd, {
      withCredentials: false,
      headers: {
        'Content-Type': undefined
      },
      transformRequest: angular.identity
    })
    .then((response) => {
      var assetId=response.data.split(".")[0]
      self.newAssets.push(assetId)
      console.log(self.newAssets)
      self.uploadState = 'done'
    }, (error) => {
      console.log(error)
    })
  }
  self.add=(place)=>{
    $http.get('http://18.220.85.229/api/PresentDayPlaces/'+place.presentPlace+'?access_token='+self.user.access_token,
    {
       params: {
        filter: {
          fields:{
            'municipality':true,
            'id':true
          },   
        }
      }
    })
    .then((res) => {    
      $http.post("http://18.220.85.229/api/AboriginalPlaces?access_token="+self.user.access_token, 
      {
        "trad_aboriginal_name": place.abName,
        "meaning": place.meaning,
        "lang_id": place.lang,
        "alt_spelling": "a",
        "geopoint": {
          "lat": place.geopoint.lat,
          "lng": place.geopoint.lng
        },
        "present_day_place_id": place.presentPlace,
        "information":place.information,
        "history":place.history,
        "community":place.community,
        "municipality":res.data.municipality
      })
      .then((response)=>{
        var newPlaceId=response.data.id
        var num=0
        if(self.newAssets.length>0){
          self.newAssets.forEach((asset)=>{
            $http.post('http://18.220.85.229/api/AboriginalPlaceAssetMappings?access_token='+self.user.access_token,
            {            
            "aboriginal_place_id": newPlaceId,
            "asset_id": asset
            })
            .then((result) => {
              num++   
              if(num==self.newAssets.length){
              $state.go('managePlace');
            }        
            })
            
            
          }) 
        }
        else{
          $state.go('managePlace');
        }       
      })

    })
    
  }
})