// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
var appContext = angular.module('starter', ['ionic','ngCordova','ionic-toast'])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);

    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
  });
})

.config(function($stateProvider, $urlRouterProvider) {
  $stateProvider

    .state('login', {
      url: '/login',
      cache: false,
      templateUrl: 'app/login/login.html',
      controller: 'LoginController'
    })

    .state('signUp', {
      url: '/signUp',
      cache: false,
      templateUrl: 'app/signUp/signUp.html',
      controller: 'SignUpController'
    })

    .state('startup', {
      url: '/startup',
      cache: false,
      templateUrl: 'app/startup/startup.html',
      controller: 'StartupController'
    })

    .state('app', {
      url: '/app',
      abstract: true,
      templateUrl: 'app/menu/menu.html',
      controller: 'MenuController'
    })

    .state('app.incident-type', {
      url: '/incident-type',
      cache : false,
      views: {
        'content': {
          templateUrl: 'app/add/template/incident-type.html',
          controller: 'TypeController'
        }
      }
    })

    .state('app.incident-photo', {
      url: '/incident-photo',
      cache : false,
      views: {
        'content': {
          templateUrl: 'app/add/template/incident-photo.html',
          controller: 'PhotoController'
        }
      }
    })

    .state('app.incident-map', {
      url: '/incident-map',
      cache : false,
      views: {
        'content': {
          templateUrl: 'app/add/template/incident-map.html',
          controller: 'MapController'
        }
      }
    })

    .state('app.incident-list', {
      url: '/incident-list',
      cache : false,
      views: {
        'content': {
          templateUrl: 'app/incident/template/incident-list.html',
          controller: 'IncidentListController'
        }
      }
    })

    .state('app.incident',{
      url : '/incident/{id:int}',
      cache : false,
      views: {
        'content': {
          templateUrl: 'app/incident/template/incident.html',
          controller : 'IncidentController'
        }
      }
    })

    .state('app.profile', {
      url: '/profile',
      cache : false,
      views: {
        'content': {
          templateUrl: 'app/profile/profile.html',
          controller : 'ProfileController'
        }
      }
    });

  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('startup');
});
