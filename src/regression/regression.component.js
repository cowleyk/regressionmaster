(function() {
  'use strict';

  angular.module('app')
  .component('regression', {
    controller: regressionController,
    templateUrl: 'src/regression/regression.component.html'
  });

  regressionController.$inject = ['$http', '$stateParams', '$state'];

  function regressionController($http, $stateParams, $state){
    const vm = this;
    console.log('homeController');

    vm.$onInit = function(){
      console.log('$onInit fired');
      vm.matrixObj = $stateParams.matrixObj;
      console.log('matrixObj.y', vm.matrixObj.y);
      vm.sse = math.multiply(math.transpose(vm.matrixObj.y),vm.matrixObj.y) - math.multiply(math.transpose(vm.matrixObj.bHat), math.multiply(math.transpose(vm.matrixObj.X), vm.matrixObj.y));
      console.log('sse', vm.sse);
      vm.sigSq = vm.sse/(vm.matrixObj.n-vm.matrixObj.p);
      console.log('sigSq', vm.sigSq);
      let sumY = 0;
      vm.matrixObj.y.forEach(function(elem){
        sumY += parseFloat(elem[0]);
      });
      vm.ssr = math.multiply(math.transpose(vm.matrixObj.bHat), math.multiply(math.transpose(vm.matrixObj.X), vm.matrixObj.y))-(sumY*sumY)/(vm.matrixObj.n);
      console.log('ssr', vm.ssr);
      vm.sst = vm.sse + vm.ssr;
      console.log('sst', vm.sst);
      vm.f0 = (vm.ssr/vm.matrixObj.k)/(vm.sse/(vm.matrixObj.n-vm.matrixObj.p));
      console.log(vm.f0);
    };



  }

})();
