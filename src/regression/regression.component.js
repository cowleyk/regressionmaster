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
    vm.showBlurbs = false;
    vm.showTableReg = false;
    vm.showTableVar = false;

    vm.$onInit = function(){
      // console.log('$onInit fired');
      vm.matrixObj = $stateParams.matrixObj;
      console.log('matrixObj', vm.matrixObj);

    }; // close vm.$onInit

    vm.toggleRegTable = function(){
      vm.showTableReg = !vm.showTableReg;
    };
    vm.toggleVarTable = function(){
      vm.showTableVar = !vm.showTableVar;
    };

    vm.setSelection = function(){
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
        let indSplice = lineArr.splice(indIndex, 1);
        yMatrix.push(indSplice);
        lineArr.unshift(1);
        xMatrix.push(lineArr);
      });
      vm.xMatrix = xMatrix;

      let n = vm.matrixObj.allDataMatrix.length;
      let k = dependentObjArr.length;
      let p = k + 1;
      let cMatrix = math.inv(math.multiply(math.transpose(xMatrix), xMatrix));
      vm.cMatrix = cMatrix;
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

      if (fTable > f0){
        vm.comparator = '>';
        vm.blurb = `${independentVar} is not linearly related any dependent variable`;
        vm.marker = '&#9746;';
        // vm.highlightF = 'true'
      }
      else{
        vm.comparator = '<'
        vm.blurb = `${independentVar} is linearly related to at least one dependent variable`;
        vm.ftestCheck = true;
        vm.marker = '&#9745;';
        // vm.marker = '&#10004;';

      }

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
        tTable: tTable,
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
            tTable: tTable,
            modinput: 'Constant'
          };
        }
        else{
          let tzero = bHatMatrix[i][0]/Math.sqrt(Math.abs(sigSq*cMatrix[i][i]));
          coeffObj = {
            name: dependentObjArr[i-1].name,
            coeff: bHatMatrix[i][0].toFixed(3),
            seCoeff: Math.sqrt(sigSq*cMatrix[i][i]).toFixed(3),
            t: Math.abs(tzero).toFixed(3),
            tTable: ' ',
            modinput: ''
          };
        }
        vm.varTableArr.push(coeffObj);
      }


      vm.showOptions = false;
      vm.showBlurbs = true;
    }; // close vm.setSelection

    vm.getPrediction = function(){
      let x0Matrix = [['1']];
      let modelY = 0;
      vm.varTableArr.forEach(function(varObj){
        if(varObj.modinput !== 'Constant'){
          x0Matrix.push([varObj.modinput]);
          modelY += varObj.coeff*parseFloat(varObj.modinput)
        }
        else{
          modelY += parseFloat(varObj.coeff);
        }
      });
      let matMultResult = math.multiply(math.multiply(math.transpose(x0Matrix), vm.cMatrix), x0Matrix);
      let plusMinus = vm.regressionObj.tTable*Math.sqrt(vm.regressionObj.sigSq*(1+matMultResult[0][0]));
      // &le;
      vm.predictMinus = (modelY - plusMinus).toFixed(3);
      vm.predictPlus = (modelY + plusMinus).toFixed(3);
      vm.showPrediction = true;

    }

    vm.dependentFilter = function(val){
      return val.name !== vm.independent;
    };



  } // close controller

})();
