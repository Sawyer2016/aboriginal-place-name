angular.module('app', [
  'ui.router',
  'angular-storage',
  'isteven-multi-select'
])

.config(($urlRouterProvider,$httpProvider) => {
  $urlRouterProvider.otherwise('/home')
   $httpProvider.interceptors.push('APIInterceptor');
})

// Remove # from url
.config(function ($locationProvider) {
  $locationProvider.html5Mode(true)
})
.service('APIInterceptor', function($rootScope, UserService) {
        var service = this;

        service.request = function(config) {
            var currentUser = UserService.getCurrentUser(),
                access_token = currentUser ? currentUser.access_token : null;

            if (access_token) {
                config.headers.authorization = access_token;
            }
            return config;
        };

        service.responseError = function(response) {
            if (response.status === 401) {
                $rootScope.$broadcast('unauthorized');

            }
            return response;
        };
    })
.service('UserService', function(store) {
        var service = this,
            currentUser = null;

        service.setCurrentUser = function(user) {
            currentUser = user;
            store.set('user', user);
            return currentUser;
        };

        service.getCurrentUser = function() {
            if (!currentUser) {
                currentUser = store.get('user');
            }
            return currentUser;
        };
    })

    .service('LoginService', function($http) {
        var service = this,
            path = 'users/';

        function getUrl() {
            return "http://18.220.85.229/api/" + path;
        }

        function getLogUrl(action) {
            return getUrl() + action;
        }

        service.login = function(credentials) {
            return $http.post(getLogUrl('login'), credentials);
        };

        service.logout = function() {
            return $http.post(getLogUrl('logout'));
        };
/*
        service.register = function(user) {
            return $http.post(getUrl(), user);
        };*/
    })

