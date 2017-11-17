'use strict'

angular.module('app')
.config(function ($stateProvider) {
  $stateProvider.state('manageLang', {
    url: 'manageLang',
    templateUrl: 'app/manageLang/manageLang.html',
    controller: 'manageLangCtrl',
    controllerAs: 'ctrl',
    parent: 'main'
  })
})
.controller('manageLangCtrl', function ($stateParams, $http,$rootScope, $state, LoginService, UserService) {
  const self = this
  
  function init () {
  self.pager = {};
  if(!localStorage.token)
       $state.go('login');
  self.user=UserService.getCurrentUser();
  self.getLangsUrl='http://18.220.85.229/api/Langs'
    $http.get(self.getLangsUrl)
    .then((response) => {
      self.langs=response.data
      self.setPage(1);
    })
  }

  init()

  self.setPage=(page)=>{

      if (page < 1 || (page > self.pager.totalPages&&self.pager.totalPages!=0) ){
          return;
      }


      // get pager object from service
      self.pager = GetPager(self.langs.length, page,10);
      // get current page of items
      self.items = self.langs.slice(self.pager.startIndex, self.pager.endIndex + 1);
  }

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

})