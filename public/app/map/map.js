'use strict'
//var sizeof = require('object-sizeof');

angular.module('app')
.config(function ($stateProvider) {
  $stateProvider.state('map', {
    url: 'map',
    templateUrl: 'app/map/map.html',
    controller: 'MapCtrl',
    controllerAs: 'ctrl',
    parent:'main'
  })
})
.controller('MapCtrl', function ($scope,$http,$sce) {
  const self = this;
  var map="";
  const placeURL='http://18.220.85.229/api/AboriginalPlaces';
  const storyURL='http://18.220.85.229/api/Stories';
  const placeLangDataURL='http://18.220.85.229/api/PlaceLangData';

  /*initialize variables*/

  function init(){
      self.alphabets=["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"];
      self.places=[];             //places listed in textarea
      self.i=0;
      $scope.languages="All";     //filter:language
      $scope.startsWith="All";    //filter:start with
      $scope.municipality="All";  //filter:municipality
      $scope.placeToSearch="";    //search bar
      self.placeInfo=[];         //information of place in pop up
      self.placeAudioURL="";      //audio url of place in pop up
      self.placeVideoURL="";      //video url of place in pop up
      self.placeImgURL="";        //images url of place in pop up
      self.limit=5;             // currently number of pins showed
      self.numOfChangedPins=20;   //each time number of changed pins
      self.initialNumOfPins=5;    //initial displayed number of pins
      self.numOfSuggestionList=6;
      self.langs = [];
      self.alllangs = [];
      self.languages = [];

      self.municipalities=["Melbourne","Malvern","Richmond","Ivanhoe","Camberwell"]
      $http.get(placeURL,{
        params: {
          filter:{
              fields:{
                id:true,
                trad_aboriginal_name:true,
                geopoint:true
              },
              order: 'name ASC'
            }    
            }     
      })
      .then((response)=>{
        self.places=response.data;
        updateMarker();

      })

    $http({
      url:'http://18.220.85.229/api/Langs',
      method:'GET'
    })
    .then((response)=>{
      self.langs=response.data;
    })
    }

  init()

  /*initialize the map*/
  function initMap(){
   /*cretaing google map*/
     map = new google.maps.Map(document.getElementById('map'), {
        center: {lat: -37.997, lng: 145.000},
        zoom: 6,
        mapTypeControl:false
      });
     /*show more button and show less button*/
      var showMoreDiv = document.createElement('div');
      var showMoreControl = new CenterControl(showMoreDiv, map,'more');
      var showLessDiv = document.createElement('div');
      var showLessControl = new CenterControl(showLessDiv, map,'less');
      var length=self.places.length;
      if(length>self.limit){
      map.controls[google.maps.ControlPosition.TOP_LEFT].push(showMoreDiv);
      }
      else if(length<=self.limit){
          showMoreDiv.style.display="none";
      }
      if(self.limit>self.initialNumOfPins){
      map.controls[google.maps.ControlPosition.LEFT_TOP].push(showLessDiv);
      }


  /*allow bounds to drag*/
    var southWest = new google.maps.LatLng(-39.298645, 140.466448);
    var northEast = new google.maps.LatLng(-34.241828, 149.870744);
    var allowedBounds = new google.maps.LatLngBounds(southWest,northEast);
    var lastValidCenter = map.getCenter();
    google.maps.event.addListener(map, 'center_changed', function() {
    if (allowedBounds.contains(map.getCenter())) {
        // still within valid bounds, so save the last valid position
        lastValidCenter = map.getCenter();
        return;
    }
    // not valid anymore => return to last valid position
    map.panTo(lastValidCenter);
  });
  }

  function CenterControl(controlDiv, map,type) {
        // Set CSS for the control border.
        var controlUI = document.createElement('div');
        controlUI.style.backgroundColor = '#fff';
        controlUI.style.border = '2px solid #fff';
        controlUI.style.borderRadius = '3px';
        controlUI.style.boxShadow = '0 2px 6px rgba(0,0,0,.3)';
        controlUI.style.cursor = 'pointer';
        controlUI.style.marginBottom = '22px';
        controlUI.style.textAlign = 'center';
        controlUI.style.display="block";
        controlDiv.appendChild(controlUI);

        // Set CSS for the control interior.
        var controlText = document.createElement('div');
        controlText.style.color = '#87CEFA';
        controlText.style.fontFamily = 'Roboto,Arial,sans-serif';
        controlText.style.fontSize = '16px';
        controlText.style.lineHeight = '38px';
        controlText.style.paddingLeft = '5px';
        controlText.style.paddingRight = '5px';
        if(type==="more"){
          controlText.innerHTML = 'View More';
        }
        else{
          controlText.innerHTML = 'View Less';
        }
        controlUI.appendChild(controlText);

        // Setup the click event listeners: simply set the map to Chicago.
        controlUI.addEventListener('click', function() {
          if(type==="more"){
          self.showMore();
        }
        else{
          self.showLess();
        }

        });
        }

  self.showLess=()=>{
    if(self.limit>self.initialNumOfPins){
    self.limit=self.limit-self.numOfChangedPins;
    updateMarker();
  }
  }
  self.showMore=()=>{
  self.limit=self.limit+self.numOfChangedPins;
    updateMarker();
  }
  self.Reset=()=>{
  self.places=[];
  self.i=0;
  self.limit=self.initialNumOfPins;
  $scope.languages="All";     //filter:language
  $scope.startsWith="All";    //filter:start with
  $scope.municipality="All";  //filter:municipality
  $scope.placeToSearch=""; 
  self.placeInfo=[];         //information of place in pop up
  self.placeAudioURL="";      //audio url of place in pop up
  self.placeVideoURL="";      //video url of place in pop up
  self.placeImgURL="";
  self.limit=5;
  $http.get(placeURL,{
        params: {
          filter:{
              fields:{
                id:true,
                trad_aboriginal_name:true,
                geopoint:true
              },
              order: 'name ASC'
            }    
            }     
      })
      .then((response)=>{
        self.places=response.data;
        updateMarker();

      })
}

  /*update the markers*/
  function updateMarker(){
     initMap();
    self.i=0;

    self.places.forEach((place)=>{

      if(self.i<self.limit){
        var myLatlng = place.geopoint;
        var marker = new google.maps.Marker({
            position: myLatlng,
        });
        marker.addListener('click',function(){
         self.placeAudioURL="";
         self.placeVedioURL="";
         self.placeImgURL="";
           $http.get(placeURL, {
          params: {
            filter: {
              include: [
              {relation:'lang'},
              {relation:'stories'},
              {relation:'present_day_place'},
              {relation:'assets'}
              ],
              where:{'trad_aboriginal_name':place.trad_aboriginal_name},
              order: 'name ASC'
            }
          }
        }).then((response)=>{
          self.placeInfo=response.data["0"];
          console.log(self.placeInfo);

          /*audio,video,images in pop up*/
          self.placeAudioURL=$sce.trustAsResourceUrl('http://18.220.85.229/api/Assets/'+self.placeInfo.pronunciation_asset_id+'/rawAsset');
          console.log('audio:'+self.placeInfo.pronunciation_asset_id)
          if(response.data["0"].assets.length!=0){
            response.data["0"].assets.forEach((asset)=>{
              var assetURL=$sce.trustAsResourceUrl('http://18.220.85.229/api/Assets/'+asset.id+'/rawAsset');
               if(asset.type==='video'){
                self.placeVideoURL=assetURL;
                console.log('video:'+asset.id)
              }
              else if(asset.type==='image'){
                self.placeImgURL=assetURL;
                console.log('image:'+asset.id)
              }
            })

          }
          $('#myModal').reveal();
        })

        })
        marker.setMap(map);
        self.i=self.i+1;
      }

    })

  }

  /*play the audio*/
  self.goPlay=()=>{
    var myAudio=document.getElementById("myAudio");
    var audioImg=document.getElementById("audioImg");
    myAudio.addEventListener('ended', function () {
    audioImg.src="../../images/audio.png";
    audioState=0;
    myAudio.currentTime=0;
    myAudio.pause();
    })
  if(audioState===0){
  myAudio.play();
  audioImg.src="../../images/pause.png";
  audioState=1;
  }
  else if (audioState===1){
  myAudio.pause();
  audioImg.src="../../images/audio.png";
  audioState=0;
  }
}
  /*search places in the input box*/
  self.searchPlaceByName=()=>{
    self.limit=self.initialNumOfPins;
    self.places=[];
    $http.get(placeURL, {
         params: {
           filter: {
             order: 'name ASC',
             where:{
              trad_aboriginal_name:{
                regexp: '/'+$scope.placeToSearch+'/i'
              }
             }
           }
         }
       })
    .then((response)=>{
      console.log( $scope.placeToSearch)
      self.places=response.data
      console.log( self.places)
      updateMarker();
      })
  }

  /*filter places by Language and startsWith*/
  self.filterPlaces=()=>{
    var newFilter={      
       order: 'name ASC',
       where:{
        municipality:$scope.municipality,
        lang_id:$scope.languages,
        trad_aboriginal_name:{
          regexp: '/^'+$scope.startsWith+'/i'
        }
       }          
    }
    self.limit=self.initialNumOfPins;
    self.places=[];
    if($scope.municipality==='All'){
      delete newFilter.where.municipality
    }
    if($scope.languages==='All'){
      delete newFilter.where.lang_id
    }
    if($scope.startsWith==='All'){
      delete newFilter.where.trad_aboriginal_name
    }
    $http.get(placeURL, {
         params: {
           filter: newFilter
         }
       })
    .then((response)=>{
      self.places=response.data
      updateMarker();
      })

  }

  self.changeDataList=()=>{    
    $http({
      url:placeURL,
      method:'GET'
    })
    .then((response)=>{
      self.suggestionlist=[];
      var num=0;   
      response.data.forEach((place)=>{
        if( (place.trad_aboriginal_name).toLowerCase().indexOf(($scope.placeToSearch).toLowerCase())>=0&&
           self.suggestionlist.indexOf(place)==-1&&$scope.placeToSearch.length>0&&num<self.numOfSuggestionList)
        {
           self.suggestionlist.push(place);
           num++;                      
        }
      })
    })
  }

  self.mykey = function (e) {
    var keycode = window.event ? e.keyCode : e.which;
    if (keycode == 13) {
        self.searchPlaceByName();
    }
  }

})
