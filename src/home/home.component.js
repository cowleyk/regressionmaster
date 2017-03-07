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


    vm.$onInit = function(){
      console.log('homeController');
      // $http.get('https://linreg-four.herokuapp.com/test').then(function(data){
      //   console.log('data.data', data.data);
      //   console.log('data', data);
      // })
    };



  }

})();
