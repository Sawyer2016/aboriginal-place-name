'use strict'

angular.module('app')
.config(function ($stateProvider) {
  $stateProvider.state('places', {
    url: 'places',
    templateUrl: 'app/places/places.html',
    controller: 'PlacesCtrl',
    controllerAs: 'ctrl',
    parent: 'main'
  })
})
.controller('PlacesCtrl', function ($http,$scope,$sce) {
  const self = this
  const placeURL='http://18.220.85.229/api/AboriginalPlaces';
  const storyURL='http://18.220.85.229/api/Stories';
  const placeLangDataURL='http://18.220.85.229/api/PlaceLangData';

  self.setPage=(page)=>{

      if (page < 1 || (page > self.pager.totalPages&&self.pager.totalPages!=0) ){
          return;
      }


      // get pager object from service
      self.pager = GetPager(self.places.length, page,3);
      // get current page of items
      self.items = self.places.slice(self.pager.startIndex, self.pager.endIndex + 1);
  }


  function init () {
    self.filter = {
      include:[
              {relation:'lang'},
              {relation:'present_day_place'},
              {relation:'assets',
               scope:{
                where:{
                  type:'image'
                }
               }}
              ],
      order: 'name ASC'
    }
    self.alphabets=["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"];
    self.places=[];             //places listed in textarea
    self.languages="All";     //filter:language
    self.startsWith="All";    //filter:start with
    self.municipality='All';  //filter:municipality
    self.placeToSearch="";    //search bar
    self.placeInfo=[];         //information of place in pop up
    self.placeImgURL="";        //images url of place in pop up
    self.numOfSuggestionList=6;
    self.items=[];
    self.pager = {};

    self.municipalities=["Melbourne","Malvern","Richmond","Ivanhoe","Camberwell"]
    fetchPlaces();




    $http({
      url:'http://18.220.85.229/api/Langs',
      method:'GET'
    })
    .then((response)=>{
      self.langs=response.data;
    })
  }

  init()


function GetPager(totalItems, currentPage, pageSize) {
      // default to first page
      currentPage = currentPage || 1;

      // default page size is 10
      pageSize = pageSize || 3;

      // calculate total pages
      var totalPages = Math.ceil(totalItems / pageSize);

      var startPage, endPage;
      if (totalPages <= 3) {
          // less than 10 total pages so show all
          startPage = 1;
          endPage = totalPages;
      } else {
          // more than 10 total pages so calculate start and end pages
          if (currentPage <= 2) {
              startPage = 1;
              endPage = 3;
          } else if (currentPage + 1 >= totalPages) {
              startPage = totalPages - 2;
              endPage = totalPages;
          } else {
              startPage = currentPage - 1;
              endPage = currentPage + 1;
          }
      }

      // calculate start and end item indexes
      var startIndex = (currentPage - 1) * pageSize;
      var endIndex = Math.min(startIndex + pageSize - 1, totalItems - 1);

      // create an array of pages to ng-repeat in the pager control
      var pages = [];
      for(var i=startPage;i<endPage + 1;i++){
        pages.push(i);
      }

      // return object with all pager properties required by the view
      return {
          totalItems: totalItems,
          currentPage: currentPage,
          pageSize: pageSize,
          totalPages: totalPages,
          startPage: startPage,
          endPage: endPage,
          startIndex: startIndex,
          endIndex: endIndex,
          pages: pages
      };
  }

   /*filter places by Language and startsWith*/
  self.filterPlaces=()=>{
    self.places=[];
    self.filter={
      include:[
              {relation:'lang'},
              {relation:'present_day_place'},
              {relation:'assets',
               scope:{
                where:{
                  type:'image'
                }
               }}
              ],
      where:{
              municipality:self.municipality,
              lang_id:self.languages,
              trad_aboriginal_name:{
                regexp: '/^'+self.startsWith+'/i'
              }
             },
      order: 'name ASC'
    }
    if(self.municipality==='All'){
      delete self.filter.where.municipality
    }
    if(self.languages==='All'){
      delete self.filter.where.lang_id
    }
    if(self.startsWith==='All'){
      delete self.filter.where.trad_aboriginal_name
    }
    fetchPlaces()
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
          if( (place.trad_aboriginal_name).toLowerCase().indexOf((self.placeToSearch).toLowerCase())>=0&&
             self.suggestionlist.indexOf(place)==-1&&self.placeToSearch.length>0&&num<self.numOfSuggestionList)
          {
            self.suggestionlist.push(place);
            num++;
          }
      })
    })

  }

  function fetchPlaces () {
    $http.get(placeURL, {
      params: {
        filter: self.filter
      }
    })
    .then((response) => {
      self.places = response.data
      /*console.log(self.places)*/
      self.setPage(1);

    })
  }

   /*search places in the input box*/
  self.searchPlaceByName = () => {
   /* if (self.placeToSearch.length) {
      self.searchFilter.where.name = {
        regexp: `/${self.placeToSearch}/i`
      }
    } else {
      delete self.filter.where.name
    }*/
    self.places=[];
    self.filter={
      include:[
              {relation:'lang'},
              {relation:'present_day_place'},
              {relation:'assets',
               scope:{
                where:{
                  type:'image'
                }
               }}
              ],
      where:{
              trad_aboriginal_name:{
                regexp: '/'+self.placeToSearch+'/i'
              }
             },
      order: 'name ASC'
    }
    if(self.placeToSearch===''){
      delete self.filter.where.trad_aboriginal_name
    }
    fetchPlaces()
  }

  self.Reset=()=>{
    init ()
}

  self.mykey = function (e) {
        var keycode = window.event ? e.keyCode : e.which;
        if (keycode == 13) {
            self.searchPlaceByName();
        }
    }
})
