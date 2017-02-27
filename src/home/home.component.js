(function() {
  'use strict';

  angular.module('app')
  .component('home', {
    controller: homeController,
    templateUrl: 'src/home/home.component.html'
  });

  homeController.$inject = ['$http', '$state'];

  function homeController($http, $state){
    const vm = this;
    console.log('homeController');

    vm.$onInit = function(){
      console.log('$onInit fired');
    };



  }

})();
