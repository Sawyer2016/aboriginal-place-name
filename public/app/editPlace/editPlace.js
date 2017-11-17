'use strict'

angular.module('app')
.config(function ($stateProvider) {
  $stateProvider.state('editPlace', {
    url: 'editPlace/:id',
    templateUrl: 'app/editPlace/editPlace.html',
    controller: 'editPlaceCtrl',
    controllerAs: 'ctrl',
    parent:'main'
  })
})
.controller('editPlaceCtrl', function ($scope,$stateParams, $http,$rootScope, $state, LoginService, UserService) {
  const self = this
  const id=$stateParams.id || ''
  function init () { 
    if(!localStorage.token)
         $state.go('login');
    self.user = UserService.getCurrentUser();
    self.presentPlaceURL='http://18.220.85.229/api/PresentDayPlaces'
    self.langURL="http://18.220.85.229/api/Langs"
    self.aboriginalURL="http://18.220.85.229/api/AboriginalPlaces/"+id+"?access_token="+self.user.access_token
    self.assetsList=[]
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

    $http.get(self.aboriginalURL,{
      params: {
        filter: {
          include:'assets'   
        }
      }
    })
    .then((response) => {
      self.place=response.data
      self.assetsList=self.place.assets
      console.log(self.place)
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
      console.log(response.data)
      self.newAssets.push(assetId)
      
      self.uploadState = 'done'
    }, (error) => {
      console.log(error)
    })
  }


  self.update=(place)=>{
    $http.get('http://18.220.85.229/api/PresentDayPlaces/'+place.present_day_place_id+'?access_token='+self.user.access_token,
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
    $http.patch(self.aboriginalURL, 
    {
      "trad_aboriginal_name": place.trad_aboriginal_name,
      "meaning": place.meaning,
      "lang_id": place.lang_id,
      "geopoint": {
        "lat": place.geopoint.lat,
        "lng": place.geopoint.lng
      },
      "present_day_place_id": place.present_day_place_id,
      "information":place.information,
      "history":place.history,
      "community":place.community,
      "municipality":res.data.municipality
    })
    .then((response)=>{
    if(self.newAssets.length>0){
      var num=0
      self.newAssets.forEach((asset)=>{
        $http.post('http://18.220.85.229/api/AboriginalPlaceAssetMappings?access_token='+self.user.access_token,
        {            
        "aboriginal_place_id": id,
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

  self.delete=()=>{
    $http.delete(self.aboriginalURL)
    .then((response) => {
      $state.go('managePlace');
    })
  }

  self.deleteAsset=(assetId)=>{
      $http.get('http://18.220.85.229/api/AboriginalPlaceAssetMappings?access_token='+self.user.access_token,
      {
        params: {
        filter: {
          where:{
            "asset_id":assetId
          }  
        }
      }
      })
      .then((res1) => {
        var modelId=res1.data[0].id
        $http.delete('http://18.220.85.229/api/AboriginalPlaceAssetMappings/'+modelId+'?access_token='+self.user.access_token)
        .then((res2) => {

          var index
          for (var i=0;i<self.assetsList.length;i++){
            if(self.assetsList[i].id==assetId)
              index=i
          }
          self.assetsList.splice(index,1)
        })      
      })
    
  }
})