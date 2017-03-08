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

    vm.$onInit = function(){
      // console.log('$onInit fired');
      vm.matrixObj = $stateParams.matrixObj;
      console.log('matrixObj', vm.matrixObj);

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
      let depVarTableArr =[];
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
      console.log('dependentObjArr', dependentObjArr);

      // define xMatrix, yMatrix
      vm.matrixObj.allDataMatrix.forEach(function(lineArr){
        let indIndex = independentObj.col_index;
        let indSplice = lineArr.splice(indIndex, 1)
        yMatrix.push(indSplice);
        lineArr.unshift(1);
        xMatrix.push(lineArr);
      });

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
      let msr = (ssr/k);
      let mse = (sse/(n-p));
      let f0 = msr/mse
      let fTable = f0Array[n-p-1][k-1];
      let tTable = tObj[n-p];

      vm.regressionObj ={
        n: n,
        k: k,
        sse: sse.toFixed(3),
        ssr: ssr.toFixed(3),
        sst: sst.toFixed(3),
        msr: msr.toFixed(3),
        mse: mse.toFixed(3),
        sigSq: sigSq.toFixed(3),
        f0: f0.toFixed(3),
        fTable: fTable,
        r2adj: 1-(sse/(n-p)/(sst/(n-1))).toFixed(3)
      };

      // TODO create variable table's array [{},{name, coefficient, se(coeff), t},{}]
      vm.varTableArr = [];
      for (let i = 0; i < bHatMatrix.length; i++) {
        let coeffObj;
        if(i === 0){
          let tzero = bHatMatrix[i][0]/Math.sqrt(Math.abs(sigSq*cMatrix[i][i]));
          coeffObj = {
            name: 'Constant',
            coeff: bHatMatrix[i][0].toFixed(3),
            seCoeff: Math.sqrt(sigSq*cMatrix[i][i]).toFixed(3),
            t: Math.abs(tzero).toFixed(3),
            tTable: tTable
          };
        }
        else{
          let tzero = bHatMatrix[i][0]/Math.sqrt(Math.abs(sigSq*cMatrix[i][i]));
          coeffObj = {
            name: dependentObjArr[i-1].name,
            coeff: bHatMatrix[i][0].toFixed(3),
            seCoeff: Math.sqrt(sigSq*cMatrix[i][i]).toFixed(3),
            t: Math.abs(tzero).toFixed(3),
            tTable: ' '
          };
        }
        vm.varTableArr.push(coeffObj);
      }


      vm.showOptions = false;
      vm.showTable = true;
    }; // close vm.setSelection

    vm.dependentFilter = function(val){
      return val.name !== vm.independent;
    };



  } // close controller

})();
