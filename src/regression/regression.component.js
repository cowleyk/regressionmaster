(function() {
  'use strict';

  angular.module('app')
  .component('regression', {
    controller: regressionController,
    templateUrl: 'src/regression/regression.component.html',
  });

  regressionController.$inject = ['$http', '$stateParams', '$state'];

  function regressionController($http, $stateParams, $state){
    const vm = this;
    vm.showOptions = true;
    vm.showTable = false;
    let regressionObj ={
      test: 'test'
    };

    vm.$onInit = function(){
      // console.log('$onInit fired');
      vm.matrixObj = $stateParams.matrixObj;
      console.log('matrixObj', vm.matrixObj);

      // vm.sigSq = vm.matrixObj.sse/(vm.matrixObj.n-vm.matrixObj.p);
      // console.log('sigSq', vm.sigSq);
      //
      // vm.f0 = (vm.matrixObj.ssr/vm.matrixObj.k)/(vm.matrixObj.sse/(vm.matrixObj.n-vm.matrixObj.p));
      // console.log('f0', vm.f0);

      // f0Array & tObj accessible!
      // access via f0 table [row(n-p-1)][column(k-1)]

      // accesses proper f0 value from table!
      // vm.f0Table = f0Array[parseInt(vm.matrixObj.n) - parseInt(vm.matrixObj.p) - 1][parseInt(vm.matrixObj.k) - 1];
      // console.log(vm.f0 > vm.f0Table); // true for pullStrength sample

      // accesses proper t value (if tcalc > ttable variable contributes significantly to model)
      // console.log('t value', tObj[parseInt(vm.matrixObj.n) - parseInt(vm.matrixObj.p)]);

      // TODO function to manip bHat vals for ng-repeat
        // array of objects w/ variable name, tTest values & tTable values
      // vm.tableArr = [];
      // for (var i = 0; i < vm.matrixObj.bHat.length; i++) {
      //   vm.tableArr.push({
      //     'bHat': vm.matrixObj.bHat[i][0],
      //     'name': vm.matrixObj.depVariables[i],
      //     'sebHatj': Math.sqrt(vm.sigSq*vm.matrixObj.C[i][i]),
      //     't':vm.matrixObj.bHat[i][0]/Math.sqrt(vm.sigSq*vm.matrixObj.C[i][i])
          // is 't' correct? (looks good for x2, not x1)
        // });
        // console.log(vm.tableArr[i].name, vm.matrixObj.C[i][i]);
      // }
      // console.log(vm.tableArr);

    }; // close vm.$onInit

    vm.setSelection = function(){
      console.log(vm.independent);
      let independentVar = vm.independent;
      let independentObj = {};
      let dependentObjArr = [];
      let yMatrix = [];
      let xMatrix = [];

      // split data based on variable selection
      vm.independentObj = vm.matrixObj.elemObjArr.forEach(function(elem){
        if(elem.name === independentVar){
          independentObj = elem;
        }
        if(elem.dependent){
          dependentObjArr.push(elem);
        }
      });
      console.log('independentObj', independentObj);
      console.log('dependentObjArr', dependentObjArr);

      // define xMatrix, yMatrix
      vm.matrixObj.allDataMatrix.forEach(function(lineArr){
        let indIndex = independentObj.col_index;
        let indSplice = lineArr.splice(indIndex, 1)
        yMatrix.push(indSplice);
        lineArr.unshift(1);
        xMatrix.push(lineArr);
      });
      console.log('yMatrix', yMatrix);
      console.log('xMatrix', xMatrix);

      let n = vm.matrixObj.allDataMatrix.length;
      let k = dependentObjArr.length;
      let p = k + 1
      let cMatrix = math.inv(math.multiply(math.transpose(xMatrix), xMatrix));
      let xPrY = math.multiply(math.transpose(xMatrix), yMatrix);
      let bHatMatrix = math.multiply(cMatrix, xPrY);
      let sse = math.multiply(math.transpose(yMatrix),yMatrix) - math.multiply(math.transpose(bHatMatrix), math.multiply(math.transpose(xMatrix), yMatrix));
      let sumY = 0;
      yMatrix.forEach(function(dp){
        sumY += parseFloat(dp[0]);
      });
      let ssr = math.multiply(math.transpose(bHatMatrix), math.multiply(math.transpose(xMatrix), yMatrix))-(sumY*sumY)/(n);
      let sst = sse + ssr;
      let sigSq = sse/(n-p);
      let f0 = (ssr/k)/(sse/(n-p));
      let fTable = f0Array[n-p-1][k-1];
      console.log('f0', f0);
      console.log('fTable', fTable);


      vm.showOptions = false;
      vm.showTable = true;
    }; // close vm.setSelection

    vm.dependentFilter = function(val){
      return val.name !== vm.independent;
    };



  } // close controller

})();
