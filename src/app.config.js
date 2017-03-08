(function() {
  'use strict';

  angular.module('app').config(config)

  config.$inject = ['$stateProvider', '$urlRouterProvider', '$locationProvider']

  function config($stateProvider, $urlRouterProvider, $locationProvider){

    // this line is optional
    $locationProvider.html5Mode(true)

    $stateProvider
      .state({
        name: 'home',
        url: '/',
        component: 'home',
      })
      .state({
        name: 'login',
        url: '/login/twitter',
        component: 'login',
      })
      .state({
        name: 'csvmanage',
        url: '/csvmanage',
        component: 'csvmanage',
      })
      .state({
        name: 'regression',
        url: '/regression',
        component: 'regression',
        params: {
          matrixObj: {
            elemObjArr: [],
            allDataMatrix: []
          }
        },
      });
  }

}());
